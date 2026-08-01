import { useNavigate } from 'react-router'
import './WelcomePage.css'

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <main className="welcome">
      <div className="welcome-content">
        <img src="/favicon.svg" alt="Logo" className="welcome-logo" />
        <h1>NukiSaves</h1>
        <p className="welcome-subtitle">Paste a link from any supported platform and download the video, audio or image</p>
        <span>No accounts, no limits, no watermarks.</span>
        <p className="welcome-platforms">TikTok · Instagram · Twitter/X · Facebook · YouTube</p>
        <button className="start-btn" onClick={() => navigate('/app')}>Start</button>
        <p className="welcome-disclaimer">
          This tool is intended strictly for personal use and educational purposes. Downloading
          copyrighted content may violate the terms of service of the source platform and
          applicable law. You are solely responsible for how you use this tool, and the developer
          accept no liability for misuse.
        </p>
      </div>
    </main>
  )
}
