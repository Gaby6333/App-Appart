import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

export default function Epicerie() {
  const [items, setItems] = useState([])
  const [texte, setTexte] = useState('')

  useEffect(() => {
    const ref = collection(db, 'epicerie')
    const unsub = onSnapshot(ref, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  function toggle(item) {
    updateDoc(doc(db, 'epicerie', item.id), { fait: !item.fait })
  }

  function retirer(id) {
    deleteDoc(doc(db, 'epicerie', id))
  }

  function ajouter(e) {
    e.preventDefault()
    if (!texte.trim()) return
    addDoc(collection(db, 'epicerie'), { texte, fait: false })
    setTexte('')
  }

  return (
    <div>
      <div className="card">
        {items.length === 0 && <p className="empty">Liste vide</p>}
        {items.map(item => (
          <div key={item.id} className={'item-row' + (item.fait ? ' done' : '')}>
            <input type="checkbox" checked={item.fait} onChange={() => toggle(item)} />
            <span>{item.texte}</span>
            <button className="remove-btn" onClick={() => retirer(item.id)}>×</button>
          </div>
        ))}
      </div>
      <form className="add-row" onSubmit={ajouter}>
        <input
          value={texte}
          onChange={e => setTexte(e.target.value)}
          placeholder="Ajouter un item"
        />
        <button type="submit">+</button>
      </form>
    </div>
  )
}
