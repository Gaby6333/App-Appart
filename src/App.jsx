import { useEffect, useState } from 'react'
import { connexion } from './firebase'
import Checklist from './components/Checklist.jsx'
import Taches from './components/Taches.jsx'
import Epicerie from './components/Epicerie.jsx'
import Depenses from './components/Depenses.jsx'

const sections = [
  { id: 'checklist', label: 'Checklist', titre: 'Checklist déménagement' },
  { id: 'taches', label: 'Tâches', titre: 'Tâches ménagères' },
  { id: 'epicerie', label: 'Épicerie', titre: 'Liste d\'épicerie' },
  { id: 'depenses', label: 'Dépenses', titre: 'Dépenses' }
]

export default function App() {
  const [pret, setPret] = useState(false)
  const [section, setSection] = useState('checklist')

  useEffect(() => {
    connexion().then(() => setPret(true))
  }, [])

  const active = sections.find(s => s.id === section)

  if (!pret) {
    return <div className="app"><p className="empty">Connexion...</p></div>
  }

  return (
    <div className="app">
      <div className="header">
        <h1>{active.titre}</h1>
      </div>
      <div className="content">
        {section === 'checklist' && <Checklist />}
        {section === 'taches' && <Taches />}
        {section === 'epicerie' && <Epicerie />}
        {section === 'depenses' && <Depenses />}
      </div>
      <div className="nav">
        <div className="nav-inner">
          {sections.map(s => (
            <button
              key={s.id}
              className={s.id === section ? 'active' : ''}
              onClick={() => setSection(s.id)}
            >
              <span className="dot" />
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
