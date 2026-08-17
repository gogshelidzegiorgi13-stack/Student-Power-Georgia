import { useState } from 'react'

function App() {
  const [user, setUser] = useState(null)
  const [pin, setPin] = useState('')
  const [result, setResult] = useState(null)
  const [yesVotes, setYesVotes] = useState(0)
  const [noVotes, setNoVotes] = useState(0)

  // 🎲 კოდის გენერაცია
  const generateUniqueCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomCode = ''
    for (let i = 0; i < 6; i++) {
      randomCode += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    const newCode = `SPG-${randomCode}`
    setPin(newCode)
    return newCode
  }

  // 🔑 Google-ით სიმულირებული ავტორიზაცია
  const handleGoogleLogin = () => {
    // იმიტირებული Google Auth
    const mockUser = { name: 'სტუდენტი / Google Account' }
    setUser(mockUser)
    const code = generateUniqueCode()
    setResult({ success: true, text: `✓ Google ავტორიზაცია წარმატებულია! თქვენი კოდია: ${code}` })
  }

  const handleVote = (type) => {
    if (!pin) {
      setResult({ success: false, text: '⚠️ ხმის მისაცემად გაიარეთ ავტორიზაცია Google-ით ან დააგენერირეთ კოდი!' })
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
            <button 
              onClick={handleGoogleLogin} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#4285F4',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '30px',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" fill="#fff"/>
                <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z" fill="#fff"/>
                <path d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" fill="#fff"/>
                <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" fill="#fff"/>
              </svg>
              Google-ით ავტორიზაცია
            </button>
          ) : (
            <div className="user-profile" style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#a5b4fc' }}>ავტორიზებულია როგორც: <b>{user.name}</b></span>
            </div>
          )}
        </div>

        {/* INPUT GROUP */}
        <div className="input-group">
          <input 
            type="text" 
            placeholder="თქვენი უნიკალური კოდი" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)}
            className="code-input"
          />
          <button onClick={generateUniqueCode} className="btn btn-secondary">
            <span>🎲</span> გენერაცია
          </button>
        </div>

        {/* VOTING BUTTONS */}
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