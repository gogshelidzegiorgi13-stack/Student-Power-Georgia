import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

function App() {
  const [user, setUser] = useState(null)
  const [pin, setPin] = useState('')
  const [result, setResult] = useState(null)
  const [yesVotes, setYesVotes] = useState(0)
  const [noVotes, setNoVotes] = useState(0)

  // Google Sign-In წარმატებული ავტორიზაცია
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential)
      setUser(decoded)

      // უნიკალური კოდის გენერაცია ავტორიზებული მომხმარებლისთვის
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let randomCode = ''
      for (let i = 0; i < 6; i++) {
        randomCode += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      setPin(`SPG-${randomCode}`)
      setResult({ success: true, text: `✓ მოგესალმებით, ${decoded.name}! თქვენი კოდი გენერირებულია.` })
    } catch (err) {
      setResult({ success: false, text: '❌ ავტორიზაციის შეცდომა.' })
    }
  }

  const handleGoogleError = () => {
    setResult({ success: false, text: '❌ Google-ით ავტორიზაცია ვერ განხორციელდა.' })
  }

  const handleVote = (type) => {
    if (!pin) {
      setResult({ success: false, text: '⚠️ ხმის მისაცემად გაიარეთ ავტორიზაცია Google-ით!' })
      return
    }

    if (type === 'yes') {
      setYesVotes(prev => prev + 1)
    } else {
      setNoVotes(prev => prev + 1)
    }

    setResult({ success: true, text: `✓ ხმა წარმატებით დაფიქსირდა კოდით: ${pin}` })
  }

  return (
    <div className="app-container">
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      <div className="glass-card">
        <div className="header">
          <div className="badge">ZK-VOTING PROTOCOL</div>
          <h1>Student Power Georgia</h1>
          <p className="subtitle">უსაფრთხო და ავტორიზებული ხმის მიცემის პორტალი</p>
        </div>

        {/* GOOGLE AUTHENTICATION */}
        <div className="auth-section" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          {!user ? (
            <>
              <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>ხმის მისაცემად გაიარეთ ავტორიზაცია:</span>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_dark"
                shape="pill"
                locale="ka"
              />
            </>
          ) : (
            <div className="user-profile" style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#a5b4fc' }}>ავტორიზებულია როგორც: <b>{user.name}</b></span>
            </div>
          )}
        </div>

        {/* PIN CODE */}
        <div className="input-group">
          <input 
            type="text" 
            placeholder="თქვენი უნიკალური კოდი (გამოჩნდება ავტორიზაციის შემდეგ)" 
            value={pin} 
            readOnly
            className="code-input"
          />
        </div>

        {/* VOTE BUTTONS */}
        <div className="vote-actions">
          <button onClick={() => handleVote('yes')} className="btn btn-vote btn-yes">
            <span>👍</span> მომხრე
          </button>
          <button onClick={() => handleVote('no')} className="btn btn-vote btn-no">
            <span>👎</span> წინააღმდეგი
          </button>
        </div>

        {result && (
          <div className={`status-box ${result.success ? 'status-success' : 'status-error'}`}>
            {result.text}
          </div>
        )}

        <div className="divider"></div>

        <div className="results-section">
          <h3>📊 საერთო შედეგები (Live)</h3>
          <div className="stats-grid">
            <div className="stat-card stat-yes">
              <span className="stat-label">მომხრე</span>
              <span className="stat-value">{yesVotes}</span>
            </div>
            <div className="stat-card stat-no">
              <span className="stat-label">წინააღმდეგი</span>
              <span className="stat-value">{noVotes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App