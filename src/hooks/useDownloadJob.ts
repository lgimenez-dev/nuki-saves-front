import { useState, useEffect, useRef } from "react";
import { POLL_INTERVAL } from "../constants";
import type { DownloadMode, DownloadRequestBody, JobState, JobResult, } from "../types";
import { postDownload, getStatus, deleteDownload } from "../services/api";
import { useJobStore } from "../store/jobStore";

export function useDownloadJob(mode: DownloadMode) {
  const { jobId, saveJob, clearJob } = useJobStore();

  const [jobState, setJobState] = useState<JobState>(() => ({
    phase: jobId ? "polling" : "idle",
    error: null,
  }));
  const [result, setResult] = useState<JobResult | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { phase } = jobState;

  // Zustand may hydrate the store after the first render — if jobId arrives
  // while phase is still 'idle', transition to polling to resume the job.
  useEffect(() => {
    if (jobId && phase === "idle") {
      setJobState({ phase: "polling", error: null });
    }
  }, [jobId]);

  const cancelInterval = () => {
    if (pollRef.current !== null) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const stopPolling = () => {
    cancelInterval();
    clearJob();
  };

  const fail = (error: string) => {
    stopPolling();
    setJobState({ phase: "failed", error });
  };

  useEffect(() => {
    if (phase !== "polling" || !jobId) {
      return;
    }

    const poll = async () => {
      try {
        const res = await getStatus(jobId);

        if (!res.ok) {
          fail(
            res.status === 404
              ? "Job not found."
              : (res.data.error ?? "Unknown error."),
          );
          return;
        }

        if (res.data.status === "completed") {
          stopPolling();
          setResult({
            downloadUrl: res.data.downloadUrl!,
            thumbnailUrl: res.data.thumbnailUrl ?? null,
          });
          setJobState({ phase: "done", error: null });
        } else if (res.data.status === "failed") {
          fail(res.data.error ?? "Download failed.");
        }
      } catch {
        fail("Connection error. Is the server running?");
      }
    };

    poll();
    pollRef.current = setInterval(poll, POLL_INTERVAL[mode]);
    return cancelInterval;
  }, [phase, jobId, mode]);

  const submit = async (body: DownloadRequestBody) => {
    setJobState({ phase: "submitting", error: null });
    setResult(null);

    try {
      const res = await postDownload(body);

      if (res.ok) {
        saveJob(res.data.jobId, mode);
        setJobState({ phase: "polling", error: null });
      } else if (res.status === 429) {
        setJobState({
          phase: "failed",
          error: `Rate limit exceeded. Try again in ${res.data.retryAfterSeconds}s.`,
        });
      } else {
        setJobState({
          phase: "failed",
          error: res.data.error ?? "Unknown error.",
        });
      }
    } catch {
      setJobState({ phase: "failed", error: "Could not reach the server." });
    }
  };

  const cancel = async () => {
    if (!jobId) return
    cancelInterval()
    await deleteDownload(jobId)
    clearJob()
    setJobState({ phase: "idle", error: null })
    setResult(null)
  }

  const reset = () => {
    stopPolling();
    setJobState({ phase: "idle", error: null });
    setResult(null);
  };

  return { ...jobState, jobId, result, submit, cancel, reset };
}
