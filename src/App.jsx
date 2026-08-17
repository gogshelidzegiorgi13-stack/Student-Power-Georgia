import { useState } from 'react'

function App() {
  const [pin, setPin] = useState('')
  const [result, setResult] = useState(null)
  const [yesVotes, setYesVotes] = useState(0)
  const [noVotes, setNoVotes] = useState(0)

  // 🔗 ჩასვი შენი რეალური Google Form-ის ან სარეგისტრაციო ლინკი აქ
  const GOOGLE_REGISTRATION_LINK = "https://forms.google.com"

  const generateUniqueCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomCode = ''
    for (let i = 0; i < 6; i++) {
      randomCode += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPin(`SPG-${randomCode}`)
  }

  const handleVote = (type) => {
    if (!pin) {
      setResult({ success: false, text: '⚠️ გთხოვთ, მიუთითოთ ან დააგენერიროთ უნიკალური კოდი!' })
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
      {/* ფონის ნეონის განათებები */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      <div className="glass-card">
        {/* ჰედერი */}
        <div className="header">
          <div className="badge">ZK-VOTING PROTOCOL</div>
          <h1>Student Power Georgia</h1>
          <p className="subtitle">უსაფრთხო, ანონიმური და გამჭვირვალე ხმის მიცემა</p>
        </div>

        {/* 🔗 გუგლის სარეგისტრაციო ლინკის ბლოკი */}
        <div className="registration-banner">
          <span>ჯერ არ ხართ დარეგისტრირებული?</span>
          <a 
            href={GOOGLE_REGISTRATION_LINK} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-link"
          >
            📝 რეგისტრაცია (Google Form) ↗
          </a>
        </div>

        {/* კოდის გენერაციის სექცია */}
        <div className="input-group">
          <input 
            type="text" 
            placeholder="შეიყვანეთ ან დააგენერიროთ კოდი" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)}
            className="code-input"
          />
          <button onClick={generateUniqueCode} className="btn btn-secondary">
            <span>🎲</span> გენერაცია
          </button>
        </div>

        {/* ხმის მიცემის ღილაკები */}
        <div className="vote-actions">
          <button onClick={() => handleVote('yes')} className="btn btn-vote btn-yes">
            <span>👍</span> მომხრე
          </button>
          <button onClick={() => handleVote('no')} className="btn btn-vote btn-no">
            <span>👎</span> წინააღმდეგი
          </button>
        </div>

        {/* შეტყობინების ბოქსი */}
        {result && (
          <div className={`status-box ${result.success ? 'status-success' : 'status-error'}`}>
            {result.text}
          </div>
        )}

        <div className="divider"></div>

        {/* შედეგების სექცია */}
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
import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode' // თუ მომხმარებლის მონაცემების წაკითხვა გინდა

function App() {
  const [user, setUser] = useState(null)
  const [pin, setPin] = useState('')
  const [result, setResult] = useState(null)
  const [yesVotes, setYesVotes] = useState(0)
  const [noVotes, setNoVotes] = useState(0)

  // Google-ით წარმატებული ავტორიზაცია
  const handleGoogleSuccess = (credentialResponse) => {
    // დეკოდირება (მომხმარებლის პროფილის მისაღებად)
    const decoded = jwtDecode(credentialResponse.credential)
    setUser(decoded)

    // ავტომატურად ვუგენერირებთ უნიკალურ ZK კოდს ავტორიზებულ მომხმარებელს
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomCode = ''
    for (let i = 0; i < 6; i++) {
      randomCode += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPin(`SPG-${randomCode}`)
    setResult({ success: true, text: `✓ მოგესალმებით, ${decoded.name}! თქვენი კოდი გენერირებულია.` })
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

    setResult({ success: true, text: `✓ ხმა წარმატებით დაფიქსირდა!` })
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

        {/* 🔑 GOOGLE AUTHENTICATION SECTION */}
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

        {/* PIN CODE display */}
        <div className="input-group">
          <input 
            type="text" 
            placeholder="თქვენი უნიკალური კოდი" 
            value={pin} 
            readOnly
            className="code-input"
          />
        </div>

        {/* VOTE ACTIONS */}
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
