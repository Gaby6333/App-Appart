import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore'

export default function Depenses() {
  const [items, setItems] = useState([])
  const [desc, setDesc] = useState('')
  const [montant, setMontant] = useState('')
  const [payeur, setPayeur] = useState('')

  useEffect(() => {
    const ref = collection(db, 'depenses')
    const unsub = onSnapshot(ref, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  function retirer(id) {
    deleteDoc(doc(db, 'depenses', id))
  }

  function ajouter(e) {
    e.preventDefault()
    if (!desc.trim() || !montant || !payeur.trim()) return
    addDoc(collection(db, 'depenses'), {
      desc,
      montant: parseFloat(montant),
      payeur
    })
    setDesc('')
    setMontant('')
  }

  const total = items.reduce((acc, i) => acc + i.montant, 0)
  const parPersonne = {}
  items.forEach(i => {
    parPersonne[i.payeur] = (parPersonne[i.payeur] || 0) + i.montant
  })
  const noms = Object.keys(parPersonne)
  let messageBalance = 'Ajoute des dépenses pour voir le solde'
  if (noms.length === 2) {
    const moitie = total / 2
    const diff = parPersonne[noms[0]] - moitie
    if (Math.abs(diff) < 0.01) {
      messageBalance = 'Vous êtes à égalité'
    } else if (diff > 0) {
      messageBalance = `${noms[1]} doit ${diff.toFixed(2)} $ à ${noms[0]}`
    } else {
      messageBalance = `${noms[0]} doit ${(-diff).toFixed(2)} $ à ${noms[1]}`
    }
  }

  return (
    <div>
      <div className="balance">
        <span>{messageBalance}</span>
        <span className="amount">{total.toFixed(2)} $ au total</span>
      </div>
      <div className="card">
        {items.length === 0 && <p className="empty">Aucune dépense pour l'instant</p>}
        {items.map(item => (
          <div key={item.id} className="money-row">
            <div style={{ flex: 1 }}>
              <div>{item.desc}</div>
              <div className="who">payé par {item.payeur}</div>
            </div>
            <span className="amount">{item.montant.toFixed(2)} $</span>
            <button className="remove-btn" onClick={() => retirer(item.id)}>×</button>
          </div>
        ))}
      </div>
      <form className="add-row" onSubmit={ajouter} style={{ flexWrap: 'wrap' }}>
        <input
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Description"
          style={{ flexBasis: '100%' }}
        />
        <input
          value={montant}
          onChange={e => setMontant(e.target.value)}
          placeholder="Montant"
          type="number"
          step="0.01"
        />
        <input
          value={payeur}
          onChange={e => setPayeur(e.target.value)}
          placeholder="Payé par"
        />
        <button type="submit">+</button>
      </form>
    </div>
  )
}
