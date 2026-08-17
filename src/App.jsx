import { useState } from 'react'

function App() {
  const [pin, setPin] = useState('')
  const [result, setResult] = useState(null)
  const [yesVotes, setYesVotes] = useState(0)
  const [noVotes, setNoVotes] = useState(0)

  // უნიკალური კოდის გენერატორი (მაგ: SPG-K8X2P9)
  const generateUniqueCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomCode = ''
    for (let i = 0; i < 6; i++) {
      randomCode += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPin(`SPG-${randomCode}`)
  }

  // ხმის მიცემის ფუნქცია
  const handleVote = (type) => {
    if (!pin) {
      setResult({ success: false, text: 'გთხოვთ, მიუთითოთ ან დააგენერიროთ კოდი!' })
      return
    }

    if (type === 'yes') {
      setYesVotes(prev => prev + 1)
    } else {
      setNoVotes(prev => prev + 1)
    }

    setResult({ success: true, text: `ხმა წარმატებით დაფიქსირდა კოდით: ${pin}` })
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Student Power Georgia — ZK-Vote</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          placeholder="შეიყვანეთ ან დააგენერირეთ კოდი" 
          value={pin} 
          onChange={(e) => setPin(e.target.value)}
          style={{ padding: '0.5rem', flex: '1' }}
        />
        <button onClick={generateUniqueCode} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          🎲 გენერაცია
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => handleVote('yes')} style={{ padding: '0.5rem 1rem', cursor: 'pointer', flex: '1' }}>
          👍 მომხრე
        </button>
        <button onClick={() => handleVote('no')} style={{ padding: '0.5rem 1rem', cursor: 'pointer', flex: '1' }}>
          👎 წინააღმდეგი
        </button>
      </div>

      {result && (
        <div style={{ 
          padding: '0.75rem', 
          borderRadius: '4px', 
          backgroundColor: result.success ? '#e6fffa' : '#ffebe9',
          color: result.success ? '#137333' : '#c5221f',
          marginBottom: '1rem'
        }}>
          {result.text}
        </div>
      )}

      <hr />
      <h4>📊 საერთო შედეგები (Live):</h4>
      <p>👍 მომხრე: <b>{yesVotes}</b> | 👎 წინააღმდეგი: <b>{noVotes}</b></p>
    </div>
  )
}

export default App
