import { useEffect, useState } from 'react'
import { db } from '../firebase'
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs
} from 'firebase/firestore'

const categories = ['Chambre', 'Salle de bain', 'Cuisine', 'Salon', 'Tout', 'Nourriture']

const items_depart = [
  ['Chambre', 'Lit et matelas'],
  ['Chambre', 'Couverture et draps'],
  ['Chambre', 'Oreillers'],
  ['Chambre', 'Table de chevet'],
  ['Chambre', 'Lumière'],
  ['Chambre', 'Cadran'],
  ['Chambre', 'Armoire'],
  ['Chambre', 'Cintres'],
  ['Chambre', 'Miroir'],
  ['Chambre', 'Store et rideaux'],
  ['Chambre', 'Panier à linge'],
  ['Salle de bain', 'Serviettes de corps et à main'],
  ['Salle de bain', 'Produits nettoyants salle de bain'],
  ['Salle de bain', 'Produit pour laveuse'],
  ['Salle de bain', 'Savon à main'],
  ['Salle de bain', 'Rideau de douche et tringle'],
  ['Salle de bain', 'Tapis de bain'],
  ['Salle de bain', 'Papier de toilette'],
  ['Cuisine', 'Grille-pain, cafetière ou micro-onde'],
  ['Cuisine', 'Vaisselle (bols et assiettes)'],
  ['Cuisine', 'Verres'],
  ['Cuisine', 'Ustensiles'],
  ['Cuisine', 'Chaudrons'],
  ['Cuisine', 'Poêlons'],
  ['Cuisine', 'Planches à découper'],
  ['Cuisine', 'Contenants de conservation'],
  ['Cuisine', 'Produit nettoyant vaisselle'],
  ['Cuisine', 'Sacs à poubelle'],
  ['Salon', 'Divan'],
  ['Salon', 'Tapis'],
  ['Salon', 'Télé'],
  ['Salon', 'Table à café'],
  ['Salon', 'Lampes d\'appoint'],
  ['Tout', 'Poubelle'],
  ['Tout', 'Balai, vadrouille, aspirateur'],
  ['Tout', 'Trousse de premiers soins'],
  ['Tout', 'Ampoules de rechange'],
  ['Nourriture', 'Épices de base'],
  ['Nourriture', 'Huile à cuisson'],
  ['Nourriture', 'Café ou thé']
]

export default function Checklist() {
  const [items, setItems] = useState([])
  const [texte, setTexte] = useState('')
  const [categorie, setCategorie] = useState(categories[0])

  useEffect(() => {
    const ref = collection(db, 'checklist')
    getDocs(ref).then(snap => {
      if (snap.empty) {
        items_depart.forEach(([cat, txt]) => {
          addDoc(ref, { texte: txt, categorie: cat, fait: false })
        })
      }
    })
    const unsub = onSnapshot(ref, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  function toggle(item) {
    updateDoc(doc(db, 'checklist', item.id), { fait: !item.fait })
  }

  function retirer(id) {
    deleteDoc(doc(db, 'checklist', id))
  }

  function ajouter(e) {
    e.preventDefault()
    if (!texte.trim()) return
    addDoc(collection(db, 'checklist'), { texte, categorie, fait: false })
    setTexte('')
  }

  return (
    <div>
      {categories.map(cat => {
        const liste = items.filter(i => i.categorie === cat)
        if (liste.length === 0) return null
        return (
          <div key={cat}>
            <div className="section-title">{cat}</div>
            <div className="card">
              {liste.map(item => (
                <div key={item.id} className={'item-row' + (item.fait ? ' done' : '')}>
                  <input type="checkbox" checked={item.fait} onChange={() => toggle(item)} />
                  <span>{item.texte}</span>
                  <button className="remove-btn" onClick={() => retirer(item.id)}>×</button>
                </div>
              ))}
            </div>
          </div>
        )
      })}
      <form className="add-row" onSubmit={ajouter}>
        <select value={categorie} onChange={e => setCategorie(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
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
