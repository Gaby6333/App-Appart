import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js'
import {
  getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs
} from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js'
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js'

const firebaseConfig = {
  apiKey: 'AIzaSyBxLzMq3gzVWMtv_7vQYNNnPDy3WEI8_YI',
  authDomain: 'app-appart.firebaseapp.com',
  projectId: 'app-appart',
  storageBucket: 'app-appart.firebasestorage.app',
  messagingSenderId: '1020449647457',
  appId: '1:1020449647457:web:e0ea4442d89207d1177320'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

const refChecklist = collection(db, 'checklist')
const refTaches = collection(db, 'taches')
const refEpicerie = collection(db, 'epicerie')
const refDepenses = collection(db, 'depenses')

const sections = [
  { id: 'checklist', label: 'Checklist', titre: 'Checklist déménagement' },
  { id: 'taches', label: 'Tâches', titre: 'Tâches ménagères' },
  { id: 'epicerie', label: 'Épicerie', titre: "Liste d'épicerie" },
  { id: 'depenses', label: 'Dépenses', titre: 'Dépenses' }
]

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
  ['Salon', "Lampes d'appoint"],
  ['Tout', 'Poubelle'],
  ['Tout', 'Balai, vadrouille, aspirateur'],
  ['Tout', 'Trousse de premiers soins'],
  ['Tout', 'Ampoules de rechange'],
  ['Nourriture', 'Épices de base'],
  ['Nourriture', 'Huile à cuisson'],
  ['Nourriture', 'Café ou thé']
]

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function goTo(id) {
  sections.forEach(s => {
    document.getElementById('section-' + s.id).classList.toggle('active', s.id === id)
  })
  document.querySelectorAll('#nav button').forEach(b => {
    b.classList.toggle('active', b.dataset.id === id)
  })
  document.getElementById('titre').textContent = sections.find(s => s.id === id).titre
}

function setupNav() {
  const nav = document.getElementById('nav')
  sections.forEach(s => {
    const btn = document.createElement('button')
    btn.dataset.id = s.id
    btn.innerHTML = '<span class="dot"></span>' + s.label
    btn.onclick = () => goTo(s.id)
    nav.appendChild(btn)
  })
  goTo('checklist')
}

function renderChecklist(items) {
  const container = document.getElementById('section-checklist')
  let html = ''
  categories.forEach(cat => {
    const liste = items.filter(i => i.categorie === cat)
    if (liste.length === 0) return
    html += `<div class="section-title">${cat}</div><div class="card">`
    liste.forEach(item => {
      html += `<div class="item-row${item.fait ? ' done' : ''}">
        <input type="checkbox" ${item.fait ? 'checked' : ''} data-id="${item.id}">
        <span>${escapeHtml(item.texte)}</span>
        <button class="remove-btn" data-id="${item.id}">×</button>
      </div>`
    })
    html += '</div>'
  })
  html += `<form class="add-row" id="checklist-form">
    <select id="checklist-categorie">${categories.map(c => `<option value="${c}">${c}</option>`).join('')}</select>
    <input id="checklist-texte" placeholder="Ajouter un item">
    <button type="submit">+</button>
  </form>`
  container.innerHTML = html

  container.querySelectorAll('input[type=checkbox]').forEach(el => {
    el.onchange = () => updateDoc(doc(refChecklist, el.dataset.id), { fait: el.checked })
  })
  container.querySelectorAll('.remove-btn').forEach(el => {
    el.onclick = () => deleteDoc(doc(refChecklist, el.dataset.id))
  })
  container.querySelector('#checklist-form').onsubmit = (e) => {
    e.preventDefault()
    const texte = document.getElementById('checklist-texte').value.trim()
    const categorie = document.getElementById('checklist-categorie').value
    if (!texte) return
    addDoc(refChecklist, { texte, categorie, fait: false })
    document.getElementById('checklist-texte').value = ''
  }
}

function initChecklist() {
  getDocs(refChecklist).then(snap => {
    if (snap.empty) {
      items_depart.forEach(([cat, txt]) => addDoc(refChecklist, { texte: txt, categorie: cat, fait: false }))
    }
  })
  onSnapshot(refChecklist, snap => {
    renderChecklist(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

function renderSimpleListe(containerId, ref, items, emptyMsg, placeholder) {
  const container = document.getElementById(containerId)
  let html = '<div class="card">'
  if (items.length === 0) html += `<p class="empty">${emptyMsg}</p>`
  items.forEach(item => {
    html += `<div class="item-row${item.fait ? ' done' : ''}">
      <input type="checkbox" ${item.fait ? 'checked' : ''} data-id="${item.id}">
      <span>${escapeHtml(item.texte)}</span>
      <button class="remove-btn" data-id="${item.id}">×</button>
    </div>`
  })
  html += `</div>
  <form class="add-row">
    <input placeholder="${placeholder}">
    <button type="submit">+</button>
  </form>`
  container.innerHTML = html

  container.querySelectorAll('input[type=checkbox]').forEach(el => {
    el.onchange = () => updateDoc(doc(ref, el.dataset.id), { fait: el.checked })
  })
  container.querySelectorAll('.remove-btn').forEach(el => {
    el.onclick = () => deleteDoc(doc(ref, el.dataset.id))
  })
  container.querySelector('form').onsubmit = (e) => {
    e.preventDefault()
    const input = e.target.querySelector('input')
    const texte = input.value.trim()
    if (!texte) return
    addDoc(ref, { texte, fait: false })
    input.value = ''
  }
}

function initTaches() {
  onSnapshot(refTaches, snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    renderSimpleListe('section-taches', refTaches, items, "Aucune tâche pour l'instant", 'Nouvelle tâche')
  })
}

function initEpicerie() {
  onSnapshot(refEpicerie, snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    renderSimpleListe('section-epicerie', refEpicerie, items, 'Liste vide', 'Ajouter un item')
  })
}

function renderDepenses(items) {
  const container = document.getElementById('section-depenses')
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

  let html = `<div class="balance">
    <span>${messageBalance}</span>
    <span class="amount">${total.toFixed(2)} $ au total</span>
  </div>
  <div class="card">`
  if (items.length === 0) html += `<p class="empty">Aucune dépense pour l'instant</p>`
  items.forEach(item => {
    html += `<div class="money-row">
      <div style="flex: 1">
        <div>${escapeHtml(item.desc)}</div>
        <div class="who">payé par ${escapeHtml(item.payeur)}</div>
      </div>
      <span class="amount">${item.montant.toFixed(2)} $</span>
      <button class="remove-btn" data-id="${item.id}">×</button>
    </div>`
  })
  html += `</div>
  <form class="add-row" id="depenses-form" style="flex-wrap: wrap">
    <input id="depenses-desc" placeholder="Description" style="flex-basis: 100%">
    <input id="depenses-montant" placeholder="Montant" type="number" step="0.01">
    <input id="depenses-payeur" placeholder="Payé par">
    <button type="submit">+</button>
  </form>`
  container.innerHTML = html

  container.querySelectorAll('.remove-btn').forEach(el => {
    el.onclick = () => deleteDoc(doc(refDepenses, el.dataset.id))
  })
  container.querySelector('#depenses-form').onsubmit = (e) => {
    e.preventDefault()
    const desc = document.getElementById('depenses-desc').value.trim()
    const montant = parseFloat(document.getElementById('depenses-montant').value)
    const payeur = document.getElementById('depenses-payeur').value.trim()
    if (!desc || !montant || !payeur) return
    addDoc(refDepenses, { desc, montant, payeur })
    document.getElementById('depenses-desc').value = ''
    document.getElementById('depenses-montant').value = ''
    document.getElementById('depenses-payeur').value = ''
  }
}

function initDepenses() {
  onSnapshot(refDepenses, snap => {
    renderDepenses(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

signInAnonymously(auth).then(() => {
  document.getElementById('loading').style.display = 'none'
  document.getElementById('nav-wrap').style.display = ''
  setupNav()
  initChecklist()
  initTaches()
  initEpicerie()
  initDepenses()
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
}
