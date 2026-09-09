import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js'
import {
  getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs, setDoc
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
const refRepas = collection(db, 'repas')
const refConfig = doc(db, 'config', 'general')

const sections = [
  { id: 'checklist', label: 'Checklist', titre: 'Checklist déménagement' },
  { id: 'taches', label: 'Tâches', titre: 'Tâches ménagères' },
  { id: 'repas', label: 'Repas', titre: 'Repas de la semaine' },
  { id: 'epicerie', label: 'Épicerie', titre: "Liste d'épicerie" },
  { id: 'depenses', label: 'Dépenses', titre: 'Dépenses' }
]

const categoriesChecklist = ['Chambre', 'Salle de bain', 'Cuisine', 'Salon', 'Tout', 'Nourriture']
const categoriesEpicerie = ['Fruits et légumes', 'Produits laitiers', 'Viandes et poissons', 'Épicerie', 'Surgelés', 'Autres']
const categoriesDepenses = ['Loyer', 'Épicerie', 'Internet/Téléphone', 'Restaurant', 'Autre']
const frequences = { hebdo: 'chaque semaine', mensuel: 'chaque mois' }
const noms_mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

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
  div.textContent = str || ''
  return div.innerHTML
}

// profil (nom sauvegardé sur cet appareil)

function currentName() {
  return localStorage.getItem('app-appart-nom') || ''
}

function ouvrirProfil() {
  document.getElementById('profil-nom').value = currentName()
  document.getElementById('profil-overlay').style.display = 'flex'
}

function fermerProfil() {
  document.getElementById('profil-overlay').style.display = 'none'
}

document.getElementById('profil-form').onsubmit = (e) => {
  e.preventDefault()
  const nom = document.getElementById('profil-nom').value.trim()
  if (!nom) return
  localStorage.setItem('app-appart-nom', nom)
  document.getElementById('nom-btn').textContent = nom
  fermerProfil()
  renderTaches(tachesItems)
  renderDepenses()
}

document.getElementById('nom-btn').onclick = ouvrirProfil

// thème clair / sombre

function basculerTheme() {
  const actuel = document.documentElement.getAttribute('data-theme')
  const estSombre = actuel ? actuel === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  const nouveau = estSombre ? 'light' : 'dark'
  localStorage.setItem('app-appart-theme', nouveau)
  document.documentElement.setAttribute('data-theme', nouveau)
  document.getElementById('theme-toggle').textContent = nouveau === 'dark' ? '☀️' : '🌙'
}

document.getElementById('theme-toggle').onclick = basculerTheme

const themeSauvegarde = localStorage.getItem('app-appart-theme')
if (themeSauvegarde) document.documentElement.setAttribute('data-theme', themeSauvegarde)
const themeEstSombre = themeSauvegarde ? themeSauvegarde === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
document.getElementById('theme-toggle').textContent = themeEstSombre ? '☀️' : '🌙'

// navigation

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

// checklist (avec compte à rebours)

let checklistItems = []
let dateCible = ''

function renderCompteARebours() {
  let texte = 'Ajoute une date pour voir le compte à rebours'
  if (dateCible) {
    const jours = Math.ceil((new Date(dateCible) - new Date(new Date().toDateString())) / 86400000)
    if (jours > 0) texte = `${jours} jour${jours > 1 ? 's' : ''} avant le déménagement`
    else if (jours === 0) texte = "C'est aujourd'hui !"
    else texte = 'Le déménagement est passé'
  }
  return `<div class="balance countdown">
    <span>${texte}</span>
    <input type="date" id="date-cible" value="${dateCible || ''}">
  </div>`
}

function renderChecklist() {
  const container = document.getElementById('section-checklist')
  let html = renderCompteARebours()
  categoriesChecklist.forEach(cat => {
    const liste = checklistItems.filter(i => i.categorie === cat)
    if (liste.length === 0) return
    html += `<div class="section-title">${cat}</div><div class="card">`
    liste.forEach(item => {
      const achete = item.achetePar ? ` <span class="tag">par ${escapeHtml(item.achetePar)}</span>` : ''
      html += `<div class="item-row${item.fait ? ' done' : ''}">
        <input type="checkbox" ${item.fait ? 'checked' : ''} data-id="${item.id}">
        <span>${escapeHtml(item.texte)}${achete}</span>
        <button class="remove-btn" data-id="${item.id}">×</button>
      </div>`
    })
    html += '</div>'
  })
  html += `<form class="add-row" id="checklist-form">
    <select id="checklist-categorie">${categoriesChecklist.map(c => `<option value="${c}">${c}</option>`).join('')}</select>
    <input id="checklist-texte" placeholder="Ajouter un item">
    <button type="submit">+</button>
  </form>`
  container.innerHTML = html

  document.getElementById('date-cible').onchange = (e) => {
    setDoc(refConfig, { dateCible: e.target.value }, { merge: true })
  }
  container.querySelectorAll('input[type=checkbox]').forEach(el => {
    el.onchange = () => updateDoc(doc(refChecklist, el.dataset.id), {
      fait: el.checked,
      achetePar: el.checked ? currentName() : null
    })
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
    checklistItems = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    renderChecklist()
  })
  onSnapshot(refConfig, snap => {
    dateCible = snap.exists() ? (snap.data().dateCible || '') : ''
    renderChecklist()
  })
}

// tâches (avec récurrence, assignation et rotation)

let tachesItems = []

function renderTaches(items) {
  const container = document.getElementById('section-taches')
  let html = '<div class="card">'
  if (items.length === 0) html += `<p class="empty">Aucune tâche pour l'instant</p>`
  items.forEach(item => {
    const assigneTag = item.assigne ? ` <span class="tag tag-assigne">${escapeHtml(item.assigne)}</span>` : ''
    const freqTag = item.recurrence && frequences[item.recurrence] ? ` <span class="tag">${frequences[item.recurrence]}</span>` : ''
    html += `<div class="item-row${item.fait ? ' done' : ''}">
      <input type="checkbox" ${item.fait ? 'checked' : ''} data-id="${item.id}">
      <span>${escapeHtml(item.texte)}${assigneTag}${freqTag}</span>
      <button class="remove-btn" data-id="${item.id}">×</button>
    </div>`
  })
  html += `</div>
  <form class="add-row" id="taches-form" style="flex-wrap: wrap">
    <input id="taches-texte" placeholder="Nouvelle tâche" style="flex-basis: 100%">
    <input id="taches-assigne" placeholder="Assigné à" value="${escapeHtml(currentName())}">
    <select id="taches-recurrence">
      <option value="aucune">Une fois</option>
      <option value="hebdo">Chaque semaine</option>
      <option value="mensuel">Chaque mois</option>
    </select>
    <input id="taches-rotation" placeholder="Rotation avec (optionnel)">
    <button type="submit">+</button>
  </form>`
  container.innerHTML = html

  container.querySelectorAll('input[type=checkbox]').forEach(el => {
    el.onchange = () => {
      const item = items.find(i => i.id === el.dataset.id)
      if (item.recurrence && item.recurrence !== 'aucune') {
        const rotation = (item.rotation || '').split(',').map(s => s.trim()).filter(Boolean)
        let prochain = item.assigne
        if (rotation.length > 1) {
          const idx = rotation.indexOf(item.assigne)
          prochain = rotation[(idx + 1) % rotation.length]
        }
        updateDoc(doc(refTaches, item.id), { fait: false, assigne: prochain })
      } else {
        updateDoc(doc(refTaches, item.id), { fait: el.checked })
      }
    }
  })
  container.querySelectorAll('.remove-btn').forEach(el => {
    el.onclick = () => deleteDoc(doc(refTaches, el.dataset.id))
  })
  container.querySelector('#taches-form').onsubmit = (e) => {
    e.preventDefault()
    const texte = document.getElementById('taches-texte').value.trim()
    const assigne = document.getElementById('taches-assigne').value.trim()
    const recurrence = document.getElementById('taches-recurrence').value
    const rotation = document.getElementById('taches-rotation').value.trim()
    if (!texte) return
    addDoc(refTaches, { texte, fait: false, assigne, recurrence, rotation })
    document.getElementById('taches-texte').value = ''
    document.getElementById('taches-rotation').value = ''
  }
}

function initTaches() {
  onSnapshot(refTaches, snap => {
    tachesItems = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    renderTaches(tachesItems)
  })
}

// épicerie (avec rayon et quantité)

let epicerieItems = []

function rayonDe(item) {
  return categoriesEpicerie.includes(item.rayon) ? item.rayon : 'Autres'
}

function renderEpicerie(items) {
  const container = document.getElementById('section-epicerie')
  let html = ''
  categoriesEpicerie.forEach(cat => {
    const liste = items.filter(i => rayonDe(i) === cat)
    if (liste.length === 0) return
    html += `<div class="section-title">${cat}</div><div class="card">`
    liste.forEach(item => {
      const qte = item.quantite ? `${escapeHtml(item.quantite)}x ` : ''
      html += `<div class="item-row${item.fait ? ' done' : ''}">
        <input type="checkbox" ${item.fait ? 'checked' : ''} data-id="${item.id}">
        <span>${qte}${escapeHtml(item.texte)}</span>
        <button class="remove-btn" data-id="${item.id}">×</button>
      </div>`
    })
    html += '</div>'
  })
  if (items.length === 0) html += '<div class="card"><p class="empty">Liste vide</p></div>'
  html += `<form class="add-row" id="epicerie-form">
    <select id="epicerie-rayon">${categoriesEpicerie.map(c => `<option value="${c}">${c}</option>`).join('')}</select>
    <input id="epicerie-qte" placeholder="Qté" style="max-width: 70px">
    <input id="epicerie-texte" placeholder="Ajouter un item">
    <button type="submit">+</button>
  </form>`
  container.innerHTML = html

  container.querySelectorAll('input[type=checkbox]').forEach(el => {
    el.onchange = () => updateDoc(doc(refEpicerie, el.dataset.id), { fait: el.checked })
  })
  container.querySelectorAll('.remove-btn').forEach(el => {
    el.onclick = () => deleteDoc(doc(refEpicerie, el.dataset.id))
  })
  container.querySelector('#epicerie-form').onsubmit = (e) => {
    e.preventDefault()
    const texte = document.getElementById('epicerie-texte').value.trim()
    const rayon = document.getElementById('epicerie-rayon').value
    const quantite = document.getElementById('epicerie-qte').value.trim()
    if (!texte) return
    addDoc(refEpicerie, { texte, rayon, quantite, fait: false })
    document.getElementById('epicerie-texte').value = ''
    document.getElementById('epicerie-qte').value = ''
  }
}

function initEpicerie() {
  onSnapshot(refEpicerie, snap => {
    epicerieItems = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    renderEpicerie(epicerieItems)
  })
}

// repas de la semaine (avec envoi des ingrédients à l'épicerie)

let repasItems = []
let semaineDebut = lundiDeCetteSemaine(new Date())
let jourOuvert = null

function lundiDeCetteSemaine(date) {
  const d = new Date(date)
  const jour = d.getDay()
  const diff = jour === 0 ? -6 : 1 - jour
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDateISO(d) {
  const annee = d.getFullYear()
  const mois = String(d.getMonth() + 1).padStart(2, '0')
  const jour = String(d.getDate()).padStart(2, '0')
  return `${annee}-${mois}-${jour}`
}

function formatJourLabel(d) {
  const noms_jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
  return `${noms_jours[d.getDay()]} ${d.getDate()} ${noms_mois[d.getMonth()]}`
}

function renderRepas() {
  const container = document.getElementById('section-repas')
  const jours = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(semaineDebut)
    d.setDate(d.getDate() + i)
    jours.push(d)
  }
  const aujourdhui = formatDateISO(new Date())

  let html = `<div class="semaine-nav">
    <button id="semaine-prec" type="button">‹</button>
    <span>${formatJourLabel(jours[0])} – ${formatJourLabel(jours[6])}</span>
    <button id="semaine-suiv" type="button">›</button>
  </div>
  <div class="repas-semaine">`

  jours.forEach(d => {
    const dateStr = formatDateISO(d)
    const item = repasItems.find(r => r.id === dateStr)
    html += `<div class="jour-card${dateStr === aujourdhui ? ' aujourdhui' : ''}">
      <div class="jour-header" data-date="${dateStr}">
        <div class="jour-nom">${formatJourLabel(d)}</div>
        <div class="jour-repas">${item && item.texte ? escapeHtml(item.texte) : 'Ajouter un repas'}</div>
      </div>`
    if (jourOuvert === dateStr) {
      html += `<div class="jour-edit">
        <input id="repas-texte" placeholder="Nom du repas" value="${escapeHtml(item ? item.texte : '')}">
        <textarea id="repas-ingredients" placeholder="Ingrédients à ajouter à l'épicerie, un par ligne">${escapeHtml(item ? item.ingredients : '')}</textarea>
        <div class="jour-actions">
          <button type="button" class="jour-save" data-date="${dateStr}">Enregistrer</button>
          <button type="button" class="jour-clear" data-date="${dateStr}">Effacer</button>
        </div>
      </div>`
    }
    html += '</div>'
  })
  html += '</div>'
  container.innerHTML = html

  document.getElementById('semaine-prec').onclick = () => {
    semaineDebut.setDate(semaineDebut.getDate() - 7)
    jourOuvert = null
    renderRepas()
  }
  document.getElementById('semaine-suiv').onclick = () => {
    semaineDebut.setDate(semaineDebut.getDate() + 7)
    jourOuvert = null
    renderRepas()
  }
  container.querySelectorAll('.jour-header').forEach(el => {
    el.onclick = () => {
      jourOuvert = jourOuvert === el.dataset.date ? null : el.dataset.date
      renderRepas()
    }
  })
  container.querySelectorAll('.jour-save').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation()
      const dateStr = el.dataset.date
      const texte = document.getElementById('repas-texte').value.trim()
      const ingredients = document.getElementById('repas-ingredients').value
      setDoc(doc(refRepas, dateStr), { date: dateStr, texte, ingredients }, { merge: true })
      ingredients.split('\n').map(l => l.trim()).filter(Boolean).forEach(ligne => {
        const dejaLa = epicerieItems.some(i => !i.fait && i.texte.toLowerCase() === ligne.toLowerCase())
        if (!dejaLa) addDoc(refEpicerie, { texte: ligne, rayon: 'Autres', quantite: '', fait: false })
      })
      jourOuvert = null
      renderRepas()
    }
  })
  container.querySelectorAll('.jour-clear').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation()
      deleteDoc(doc(refRepas, el.dataset.date))
      jourOuvert = null
      renderRepas()
    }
  })
}

function initRepas() {
  onSnapshot(refRepas, snap => {
    repasItems = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    renderRepas()
  })
}

// dépenses (avec catégories, mois et règlement à N personnes)

let depensesItems = []
let moisSelectionne = 'tous'

function moisDisponibles(items) {
  const set = new Set()
  items.forEach(i => { if (i.date) set.add(i.date.slice(0, 7)) })
  return Array.from(set).sort().reverse()
}

function formatMois(cle) {
  const [an, mois] = cle.split('-')
  return `${noms_mois[parseInt(mois, 10) - 1]} ${an}`
}

function calculerReglement(items) {
  const total = items.reduce((acc, i) => acc + i.montant, 0)
  const parPersonne = {}
  items.forEach(i => {
    parPersonne[i.payeur] = (parPersonne[i.payeur] || 0) + i.montant
  })
  const noms = Object.keys(parPersonne)
  if (noms.length === 0) return { total, transactions: [] }
  const part = total / noms.length
  const soldes = noms.map(n => ({ nom: n, solde: parPersonne[n] - part }))
  const creanciers = soldes.filter(s => s.solde > 0.01).sort((a, b) => b.solde - a.solde)
  const debiteurs = soldes.filter(s => s.solde < -0.01).sort((a, b) => a.solde - b.solde)
  const transactions = []
  let i = 0
  let j = 0
  while (i < debiteurs.length && j < creanciers.length) {
    const d = debiteurs[i]
    const c = creanciers[j]
    const montant = Math.min(-d.solde, c.solde)
    transactions.push({ de: d.nom, a: c.nom, montant })
    d.solde += montant
    c.solde -= montant
    if (Math.abs(d.solde) < 0.01) i++
    if (Math.abs(c.solde) < 0.01) j++
  }
  return { total, transactions }
}

function renderDepenses() {
  const container = document.getElementById('section-depenses')
  const items = moisSelectionne === 'tous'
    ? depensesItems
    : depensesItems.filter(i => i.date && i.date.slice(0, 7) === moisSelectionne)
  const { total, transactions } = calculerReglement(items)

  let messageBalance = 'Ajoute des dépenses pour voir le solde'
  if (items.length > 0) {
    messageBalance = transactions.length === 0
      ? 'Vous êtes à égalité'
      : transactions.map(t => `${t.de} doit ${t.montant.toFixed(2)} $ à ${t.a}`).join('<br>')
  }

  const mois = moisDisponibles(depensesItems)

  let html = `<div class="balance">
    <span>${messageBalance}</span>
    <span class="amount">${total.toFixed(2)} $ au total</span>
  </div>
  <select id="depenses-mois" class="mois-select">
    <option value="tous">Tous les mois</option>
    ${mois.map(m => `<option value="${m}"${m === moisSelectionne ? ' selected' : ''}>${formatMois(m)}</option>`).join('')}
  </select>
  <div class="card">`
  if (items.length === 0) html += `<p class="empty">Aucune dépense pour l'instant</p>`
  items.forEach(item => {
    const categorieTag = item.categorie ? ` <span class="tag">${escapeHtml(item.categorie)}</span>` : ''
    html += `<div class="money-row">
      <div style="flex: 1">
        <div>${escapeHtml(item.desc)}${categorieTag}</div>
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
    <input id="depenses-payeur" placeholder="Payé par" value="${escapeHtml(currentName())}">
    <select id="depenses-categorie">${categoriesDepenses.map(c => `<option value="${c}">${c}</option>`).join('')}</select>
    <button type="submit">+</button>
  </form>`
  container.innerHTML = html

  document.getElementById('depenses-mois').value = moisSelectionne
  document.getElementById('depenses-mois').onchange = (e) => {
    moisSelectionne = e.target.value
    renderDepenses()
  }
  container.querySelectorAll('.remove-btn').forEach(el => {
    el.onclick = () => deleteDoc(doc(refDepenses, el.dataset.id))
  })
  container.querySelector('#depenses-form').onsubmit = (e) => {
    e.preventDefault()
    const desc = document.getElementById('depenses-desc').value.trim()
    const montant = parseFloat(document.getElementById('depenses-montant').value)
    const payeur = document.getElementById('depenses-payeur').value.trim()
    const categorie = document.getElementById('depenses-categorie').value
    if (!desc || !montant || !payeur) return
    addDoc(refDepenses, { desc, montant, payeur, categorie, date: new Date().toISOString().slice(0, 10) })
    document.getElementById('depenses-desc').value = ''
    document.getElementById('depenses-montant').value = ''
  }
}

function initDepenses() {
  onSnapshot(refDepenses, snap => {
    depensesItems = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    renderDepenses()
  })
}

signInAnonymously(auth).then(() => {
  document.getElementById('loading').style.display = 'none'
  document.getElementById('nav-wrap').style.display = ''
  setupNav()
  initChecklist()
  initTaches()
  initRepas()
  initEpicerie()
  initDepenses()

  document.getElementById('nom-btn').textContent = currentName() || 'Profil'
  if (!currentName()) ouvrirProfil()
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
}
