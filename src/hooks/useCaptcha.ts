import { useEffect, useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import type { Phase } from '../types'

export function useCaptcha(phase: Phase) {
  const [token, setToken] = useState<string | null>(null)
  const ref = useRef<ReCAPTCHA>(null)

  const reset = () => {
    ref.current?.reset()
    setToken(null)
  }

  useEffect(() => {
    if (phase === 'done' || phase === 'failed') {
      reset()
    }
  }, [phase])

  return {
    ref,
    token,
    onChange: setToken,
    onExpired: () => setToken(null),
    reset
  }
}
