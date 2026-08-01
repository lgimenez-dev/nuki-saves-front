import { useState } from "react";
import type { DownloadOptions, DownloadRequestBody } from "../types";
import { useJobStore } from "../store/jobStore";
import { DEFAULTS_DOWNLOADS_OPTIONS } from "../constants";


export function useDownloadOptions() {
  const [opts, setOpts] = useState<DownloadOptions>(() => ({
    ...DEFAULTS_DOWNLOADS_OPTIONS,
    mode: useJobStore.getState().mode,
  }));

  const set = <K extends keyof DownloadOptions>(key: K, value: DownloadOptions[K]) =>
    setOpts((prev) => ({ ...prev, [key]: value }));

  const buildBody = (url: string): DownloadRequestBody => {
    const { mode, audioOnly, audioFormat, audioQuality, resolution, videoFormat, noWatermark } = opts;
    const body: DownloadRequestBody = { url, mode, writeThumbnail: true };
    if (audioOnly) {
      body.audioOnly = true;
      body.audioFormat = audioFormat;
      body.audioQuality = audioQuality;
    }
    if (mode === "single") {
      if (resolution) {
        body.resolution = resolution;
      }
      if (!audioOnly && videoFormat) {
        body.format = videoFormat;
      }
      if (noWatermark) {
        body.noWatermark = true;
      }
    }
    return body;
  };

  const reset = () => setOpts((prev) => ({ ...prev, mode: DEFAULTS_DOWNLOADS_OPTIONS.mode }));

  return { opts, set, buildBody, reset };
}
