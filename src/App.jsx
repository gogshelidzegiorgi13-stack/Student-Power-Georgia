import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { createClient } from '@supabase/supabase-js'

// 🔑 Supabase ინიციალიზაცია პირდაპირ App.jsx-ში:
const supabaseUrl = 'https://jngzlorzhnzcffgoxdzn.supabase.co'
// ⚠️ ჩასვი შენი სრული Publishable Key (სამი წერტილის '...' გარეშე)
const supabaseAnonKey = 'sb_publishable_nbbT_om7rJ_8ZUHuH9cpjA_QRndi'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [user, setUser] = useState(null)
  const [pin, setPin] = useState('')
  const [result, setResult] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(false)

  // 🔑 Google Login & Check Database
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true)
    try {
      const decoded = jwtDecode(credentialResponse.credential)
      setUser(decoded)

      // 1. ვამოწმებთ Supabase ბაზაში: ხომ არ არის ეს ელფოსტა უკვე votes ცხრილში?
      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .eq('email', decoded.email)
        .maybeSingle()

      if (data) {
        // ❌ თუ ბაზაში იპოვა ეს მეილი — ვბლოკავთ!
        setHasVoted(true)
        setPin(data.pin)
        setResult({
          success: false,
          text: `⚠️ თქვენ უკვე მიეცით ხმა კოდით: ${data.pin}. განმეორებით ხმის მიცემა დაბლოკილია!`
        })
      } else {
        // ✅ თუ ახალი მომხმარებელია — ვგენერირებთ კოდს
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let randomCode = ''
        for (let i = 0; i < 6; i++) {
          randomCode += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        const generatedPin = `SPG-${randomCode}`
        setPin(generatedPin)
        setHasVoted(false)

        setResult({
          success: true,
          text: `✓ მოგესალმებით, ${decoded.name}! თქვენი კოდია: ${generatedPin}`
        })
      }
    } catch (err) {
      console.error(err)
      setResult({ success: false, text: '❌ შეცდომა ავტორიზაციისას.' })
    } finally {
      setLoading(false)
    }
  }

  // 🗳️ ხმის მიცემა და Supabase-ში ჩაწერა
  const handleVote = async (type) => {
    if (!user) {
      setResult({ success: false, text: '⚠️ ხმის მისაცემად გაიარეთ ავტორიზაცია Google-ით!' })
      return
    }

    if (hasVoted) {
      setResult({ success: false, text: '⚠️ თქვენ უკვე დაფიქსირებული გაქვთ ხმა!' })
      return
    }

    setLoading(true)

    // ჩაწერა Supabase ბაზაში
    const { error } = await supabase
      .from('votes')
      .insert([
        { email: user.email, vote_type: type, pin: pin }
      ])

    if (error) {
      if (error.code === '23505') {
        setHasVoted(true)
        setResult({ success: false, text: '⚠️ ბაზის დაცვა: ამ ელფოსტით ხმა უკვე დაფიქსირებულია!' })
      } else {
        console.error(error)
        setResult({ success: false, text: '❌ ხმის ჩაწერა ვერ მოხერხდა.' })
      }
    } else {
      setHasVoted(true)
      setResult({ success: true, text: `🎉 თქვენი ხმა წარმატებით დარეგისტრირდა! კოდი: ${pin}` })
    }
    setLoading(false)
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

        <div className="auth-section" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          {!user ? (
            <>
              <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>ავტორიზაცია Google-ით:</span>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setResult({ success: false, text: '❌ ავტორიზაციის შეცდომა' })}
                theme="filled_dark"
                shape="pill"
                locale="ka"
              />
            </>
          ) : (
            <div className="user-profile" style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: '12px', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user.picture && <img src={user.picture} alt="profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />}
              <span style={{ fontSize: '0.85rem', color: '#a5b4fc' }}>ავტორიზებულია: <b>{user.name}</b></span>
            </div>
          )}
        </div>

        <div className="input-group">
          <input 
            type="text" 
            placeholder="თქვენი კოდი (გამოჩნდება ავტორიზაციის შემდეგ)" 
            value={pin} 
            readOnly
            className="code-input"
          />
        </div>

        <div className="vote-actions">
          <button 
            onClick={() => handleVote('yes')} 
            disabled={hasVoted || !user || loading} 
            className="btn btn-vote btn-yes"
            style={{ opacity: (hasVoted || !user || loading) ? 0.4 : 1, cursor: (hasVoted || !user || loading) ? 'not-allowed' : 'pointer' }}
          >
            <span>👍</span> მომხრე
          </button>
          <button 
            onClick={() => handleVote('no')} 
            disabled={hasVoted || !user || loading} 
            className="btn btn-vote btn-no"
            style={{ opacity: (hasVoted || !user || loading) ? 0.4 : 1, cursor: (hasVoted || !user || loading) ? 'not-allowed' : 'pointer' }}
          >
            <span>👎</span> წინააღმდეგი
          </button>
        </div>

        {result && (
          <div className={`status-box ${result.success ? 'status-success' : 'status-error'}`} style={{ marginTop: '15px' }}>
            {result.text}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
