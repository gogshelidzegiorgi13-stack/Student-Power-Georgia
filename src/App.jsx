import { useState } from 'react'
import './App.css'

function App() {
  const [pin, setPin] = useState('')
  const [option, setOption] = useState('მომხრე')
  const [result, setResult] = useState(null)
  const [yesVotes, setYesVotes] = useState(0)
  const [noVotes, setNoVotes] = useState(0)

  const handleVote = () => {
    if (!pin) {
      alert("გთხოვთ შეიყვანოთ საიდუმლო PIN!")
      return
    }

    setResult({ type: 'loading', text: '⏳ მოწმდება ZK-Proof...' })

    setTimeout(() => {
      if (pin === '777') {
        if (option === 'მომხრე') setYesVotes(yesVotes + 1)
        else setNoVotes(noVotes + 1)

        const fakeNullifier = "nullifier_0x" + Math.random().toString(36).substring(2, 9)
        setResult({ 
          type: 'success', 
          text: `✅ ხმა დაფიქსირდა! (არჩევანი: ${option}) \nანონიმური ID: ${fakeNullifier}` 
        })
        setPin('')
      } else {
        setResult({ type: 'error', text: '❌ ვერიფიკაცია ჩაიშალა! PIN არასწორია.' })
      }
    }, 600)
  }

  return (
    <div className="card">
      <h2>🗳️ ანონიმური ხმის მიცემა</h2>
      <p>საკითხი: <b>„გამოეყოს თუ არა ბიუჯეტიდან თანხა ახალ პროექტს?“</b></p>
      
      <label><b>შენი არჩევანი:</b></label>
      <select value={option} onChange={(e) => setOption(e.target.value)}>
        <option value="მომხრე">YES - მომხრე</option>
        <option value="წინააღმდეგი">NO - წინააღმდეგი</option>
      </select>

      <input 
        type="password" 
        placeholder="შენი საიდუმლო PIN (მაგ: 777)"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
      
      <button onClick={handleVote}>ხმის დაფიქსირება (ZK-Vote)</button>

      {result && (
        <div className={`result-box ${result.type}`}>
          {result.text}
        </div>
      )}

      <hr />
      <h4>📊 საერთო შედეგები (Live):</h4>
      <p>👍 მომხრე: <b>{yesVotes}</b> | 👎 წინააღმდეგი: <b>{noVotes}</b></p>
    </div>


  )
