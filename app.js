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
const refFavoris = collection(db, 'favoris')
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
const moments = [
  { id: 'dejeuner', label: 'Déjeuner' },
  { id: 'diner', label: 'Dîner' },
  { id: 'souper', label: 'Souper' }
]

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

// profil (Léonie ou Gabriel)

function currentName() {
  return localStorage.getItem('app-appart-nom') || ''
}

function ouvrirProfil() {
  document.getElementById('profil-overlay').style.display = 'flex'
}

function fermerProfil() {
  document.getElementById('profil-overlay').style.display = 'none'
}

function choisirProfil(nom) {
  localStorage.setItem('app-appart-nom', nom)
  document.getElementById('nom-btn').textContent = nom
  fermerProfil()
  renderDepenses()
}

document.querySelectorAll('.profil-bouton').forEach(btn => {
  btn.onclick = () => choisirProfil(btn.dataset.nom)
})

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

// checklist (avec compte à rebours, lien et note par item)

let checklistItems = []
let dateCible = ''
let checklistOuvert = null

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
      const badges = [item.lien ? '🔗' : '', item.note ? '📝' : ''].filter(Boolean).join(' ')
      html += `<div class="item-row${item.fait ? ' done' : ''}">
        <input type="checkbox" ${item.fait ? 'checked' : ''} data-id="${item.id}">
        <span>${escapeHtml(item.texte)}${achete}${badges ? ' ' + badges : ''}</span>
        <button class="detail-btn" type="button" data-id="${item.id}">${checklistOuvert === item.id ? '▲' : '▾'}</button>
        <button class="remove-btn" data-id="${item.id}">×</button>
      </div>`
      if (checklistOuvert === item.id) {
        html += `<div class="jour-edit">
          <input type="url" class="item-lien" placeholder="Lien (ex: page du produit)" value="${escapeHtml(item.lien)}">
          <textarea class="item-note" placeholder="Note">${escapeHtml(item.note)}</textarea>
          <div class="jour-actions">
            <button type="button" class="item-save-details" data-id="${item.id}">Enregistrer</button>
          </div>
        </div>`
      }
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
  container.querySelectorAll('.detail-btn').forEach(el => {
    el.onclick = () => {
      checklistOuvert = checklistOuvert === el.dataset.id ? null : el.dataset.id
      renderChecklist()
    }
  })
  container.querySelectorAll('.item-save-details').forEach(el => {
    el.onclick = () => {
      const id = el.dataset.id
      const panneau = el.closest('.jour-edit')
      const lien = panneau.querySelector('.item-lien').value.trim()
      const note = panneau.querySelector('.item-note').value.trim()
      updateDoc(doc(refChecklist, id), { lien, note })
      checklistOuvert = null
      renderChecklist()
    }
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

// tâches (liste de rappels, avec récurrence)

function renderTaches(items) {
  const container = document.getElementById('section-taches')
  let html = '<div class="card">'
  if (items.length === 0) html += `<p class="empty">Aucune tâche pour l'instant</p>`
  items.forEach(item => {
    const recurrente = item.recurrence && item.recurrence !== 'aucune'
    const freqTag = recurrente ? ` <span class="tag">${frequences[item.recurrence]}</span>` : ''
    const quiTag = recurrente
      ? (item.dernierFaitPar ? ` <span class="tag tag-assigne">dernier: ${escapeHtml(item.dernierFaitPar)}</span>` : '')
      : (item.faitPar ? ` <span class="tag tag-assigne">par ${escapeHtml(item.faitPar)}</span>` : '')
    html += `<div class="item-row${item.fait ? ' done' : ''}">
      <input type="checkbox" ${item.fait ? 'checked' : ''} data-id="${item.id}">
      <span>${escapeHtml(item.texte)}${quiTag}${freqTag}</span>
      <button class="remove-btn" data-id="${item.id}">×</button>
    </div>`
  })
  html += `</div>
  <form class="add-row" id="taches-form">
    <input id="taches-texte" placeholder="Nouvelle tâche">
    <select id="taches-recurrence">
      <option value="aucune">Une fois</option>
      <option value="hebdo">Chaque semaine</option>
      <option value="mensuel">Chaque mois</option>
    </select>
    <button type="submit">+</button>
  </form>`
  container.innerHTML = html

  container.querySelectorAll('input[type=checkbox]').forEach(el => {
    el.onchange = () => {
      const item = items.find(i => i.id === el.dataset.id)
      if (item.recurrence && item.recurrence !== 'aucune') {
        updateDoc(doc(refTaches, item.id), { fait: false, dernierFaitPar: currentName() })
      } else {
        updateDoc(doc(refTaches, item.id), { fait: el.checked, faitPar: el.checked ? currentName() : null })
      }
    }
  })
  container.querySelectorAll('.remove-btn').forEach(el => {
    el.onclick = () => deleteDoc(doc(refTaches, el.dataset.id))
  })
  container.querySelector('#taches-form').onsubmit = (e) => {
    e.preventDefault()
    const texte = document.getElementById('taches-texte').value.trim()
    const recurrence = document.getElementById('taches-recurrence').value
    if (!texte) return
    addDoc(refTaches, { texte, fait: false, recurrence })
    document.getElementById('taches-texte').value = ''
  }
}

function initTaches() {
  onSnapshot(refTaches, snap => {
    renderTaches(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

// épicerie (rayon, quantité, prix, recherche, favoris)

let epicerieItems = []
let favoris = []
let epicerieRecherche = ''

function rayonDe(item) {
  return categoriesEpicerie.includes(item.rayon) ? item.rayon : 'Autres'
}

function estFavori(texte) {
  return favoris.some(f => f.texte.toLowerCase() === texte.toLowerCase())
}

function renderEpicerie() {
  const container = document.getElementById('section-epicerie')
  const recherche = epicerieRecherche.trim().toLowerCase()
  const items = recherche ? epicerieItems.filter(i => i.texte.toLowerCase().includes(recherche)) : epicerieItems
  const totalEstime = epicerieItems.filter(i => !i.fait && i.prix).reduce((acc, i) => acc + parseFloat(i.prix), 0)

  let html = `<input type="text" id="epicerie-recherche" class="mois-select" placeholder="Rechercher un item..." value="${escapeHtml(epicerieRecherche)}">`

  if (totalEstime > 0) {
    html += `<div class="balance"><span>Total estimé à acheter</span><span class="amount">${totalEstime.toFixed(2)} $</span></div>`
  }

  if (favoris.length > 0) {
    html += '<div class="favoris-chips">'
    favoris.forEach(f => {
      html += `<span class="chip" data-texte="${escapeHtml(f.texte)}" data-rayon="${escapeHtml(f.rayon)}">${escapeHtml(f.texte)}<span class="chip-x" data-id="${f.id}">×</span></span>`
    })
    html += '</div>'
  }

  categoriesEpicerie.forEach(cat => {
    const liste = items.filter(i => rayonDe(i) === cat)
    if (liste.length === 0) return
    html += `<div class="section-title">${cat}</div><div class="card">`
    liste.forEach(item => {
      const qte = item.quantite ? `${escapeHtml(item.quantite)}x ` : ''
      const prixTag = item.prix ? ` <span class="tag">${parseFloat(item.prix).toFixed(2)} $</span>` : ''
      html += `<div class="item-row${item.fait ? ' done' : ''}">
        <input type="checkbox" ${item.fait ? 'checked' : ''} data-id="${item.id}">
        <span>${qte}${escapeHtml(item.texte)}${prixTag}</span>
        <button class="fav-btn" type="button" data-texte="${escapeHtml(item.texte)}" data-rayon="${escapeHtml(rayonDe(item))}">${estFavori(item.texte) ? '★' : '☆'}</button>
        <button class="remove-btn" data-id="${item.id}">×</button>
      </div>`
    })
    html += '</div>'
  })
  if (items.length === 0) html += `<div class="card"><p class="empty">${recherche ? 'Aucun résultat' : 'Liste vide'}</p></div>`

  html += `<form class="add-row" id="epicerie-form">
    <select id="epicerie-rayon">${categoriesEpicerie.map(c => `<option value="${c}">${c}</option>`).join('')}</select>
    <input id="epicerie-qte" placeholder="Qté" style="max-width: 60px">
    <input id="epicerie-prix" placeholder="Prix" type="number" step="0.01" style="max-width: 70px">
    <input id="epicerie-texte" placeholder="Ajouter un item">
    <button type="submit">+</button>
  </form>`
  container.innerHTML = html

  document.getElementById('epicerie-recherche').oninput = (e) => {
    epicerieRecherche = e.target.value
    renderEpicerie()
    const input = document.getElementById('epicerie-recherche')
    input.focus()
    input.setSelectionRange(input.value.length, input.value.length)
  }
  container.querySelectorAll('input[type=checkbox]').forEach(el => {
    el.onchange = () => updateDoc(doc(refEpicerie, el.dataset.id), { fait: el.checked })
  })
  container.querySelectorAll('.remove-btn').forEach(el => {
    el.onclick = () => deleteDoc(doc(refEpicerie, el.dataset.id))
  })
  container.querySelectorAll('.fav-btn').forEach(el => {
    el.onclick = () => {
      const texte = el.dataset.texte
      const existant = favoris.find(f => f.texte.toLowerCase() === texte.toLowerCase())
      if (existant) deleteDoc(doc(refFavoris, existant.id))
      else addDoc(refFavoris, { texte, rayon: el.dataset.rayon })
    }
  })
  container.querySelectorAll('.chip').forEach(el => {
    el.onclick = (e) => {
      if (e.target.classList.contains('chip-x')) {
        deleteDoc(doc(refFavoris, e.target.dataset.id))
        return
      }
      addDoc(refEpicerie, { texte: el.dataset.texte, rayon: el.dataset.rayon, quantite: '', prix: '', fait: false })
    }
  })
  container.querySelector('#epicerie-form').onsubmit = (e) => {
    e.preventDefault()
    const texte = document.getElementById('epicerie-texte').value.trim()
    const rayon = document.getElementById('epicerie-rayon').value
    const quantite = document.getElementById('epicerie-qte').value.trim()
    const prix = document.getElementById('epicerie-prix').value.trim()
    if (!texte) return
    addDoc(refEpicerie, { texte, rayon, quantite, prix, fait: false })
    document.getElementById('epicerie-texte').value = ''
    document.getElementById('epicerie-qte').value = ''
    document.getElementById('epicerie-prix').value = ''
  }
}

function initEpicerie() {
  onSnapshot(refEpicerie, snap => {
    epicerieItems = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    renderEpicerie()
  })
}

function initFavoris() {
  onSnapshot(refFavoris, snap => {
    favoris = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    renderEpicerie()
  })
}

// repas de la semaine (déjeuner, dîner, souper)

let repasItems = []
let semaineDebut = lundiDeCetteSemaine(new Date())
let repasOuvert = null

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
    const jourItem = repasItems.find(r => r.id === dateStr) || {}
    html += `<div class="jour-card${dateStr === aujourdhui ? ' aujourdhui' : ''}">
      <div class="jour-nom">${formatJourLabel(d)}</div>`
    moments.forEach(m => {
      const repasMoment = jourItem[m.id]
      const cle = dateStr + '|' + m.id
      html += `<div class="repas-moment" data-date="${dateStr}" data-moment="${m.id}">
        <span class="moment-label">${m.label}</span>
        <span class="moment-texte">${repasMoment && repasMoment.texte ? escapeHtml(repasMoment.texte) : 'Ajouter'}</span>
      </div>`
      if (repasOuvert === cle) {
        html += `<div class="jour-edit">
          <input id="repas-texte" placeholder="Nom du repas" value="${escapeHtml(repasMoment ? repasMoment.texte : '')}">
          <textarea id="repas-ingredients" placeholder="Ingrédients à ajouter à l'épicerie, un par ligne">${escapeHtml(repasMoment ? repasMoment.ingredients : '')}</textarea>
          <div class="jour-actions">
            <button type="button" class="jour-save" data-date="${dateStr}" data-moment="${m.id}">Enregistrer</button>
            <button type="button" class="jour-clear" data-date="${dateStr}" data-moment="${m.id}">Effacer</button>
          </div>
        </div>`
      }
    })
    html += '</div>'
  })
  html += '</div>'
  container.innerHTML = html

  document.getElementById('semaine-prec').onclick = () => {
    semaineDebut.setDate(semaineDebut.getDate() - 7)
    repasOuvert = null
    renderRepas()
  }
  document.getElementById('semaine-suiv').onclick = () => {
    semaineDebut.setDate(semaineDebut.getDate() + 7)
    repasOuvert = null
    renderRepas()
  }
  container.querySelectorAll('.repas-moment').forEach(el => {
    el.onclick = () => {
      const cle = el.dataset.date + '|' + el.dataset.moment
      repasOuvert = repasOuvert === cle ? null : cle
      renderRepas()
    }
  })
  container.querySelectorAll('.jour-save').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation()
      const dateStr = el.dataset.date
      const moment = el.dataset.moment
      const texte = document.getElementById('repas-texte').value.trim()
      const ingredients = document.getElementById('repas-ingredients').value
      setDoc(doc(refRepas, dateStr), { date: dateStr, [moment]: { texte, ingredients } }, { merge: true })
      ingredients.split('\n').map(l => l.trim()).filter(Boolean).forEach(ligne => {
        const dejaLa = epicerieItems.some(i => !i.fait && i.texte.toLowerCase() === ligne.toLowerCase())
        if (!dejaLa) addDoc(refEpicerie, { texte: ligne, rayon: 'Autres', quantite: '', prix: '', fait: false })
      })
      repasOuvert = null
      renderRepas()
    }
  })
  container.querySelectorAll('.jour-clear').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation()
      setDoc(doc(refRepas, el.dataset.date), { [el.dataset.moment]: null }, { merge: true })
      repasOuvert = null
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

// dépenses (catégories, mois, règlement à N personnes, récurrentes)

let depensesItems = []

function moisActuelCle() {
  return new Date().toISOString().slice(0, 7)
}

let moisSelectionne = moisActuelCle()

function categorieDe(item) {
  return categoriesDepenses.includes(item.categorie) ? item.categorie : 'Autre'
}

function itemsPourMois(mois) {
  const uniques = depensesItems.filter(i => !i.recurrente && (mois === 'tous' || (i.date && i.date.slice(0, 7) === mois)))
  const instances = []
  depensesItems.filter(i => i.recurrente).forEach(r => {
    const paiements = r.moisPayes || {}
    const moisPayes = mois === 'tous' ? Object.keys(paiements).filter(m => paiements[m]) : (paiements[mois] ? [mois] : [])
    moisPayes.forEach(m => {
      instances.push({ id: r.id + '-' + m, desc: r.desc, montant: r.montant, payeur: r.payeur, categorie: r.categorie, instance: true })
    })
  })
  return uniques.concat(instances)
}

function moisDisponibles() {
  const set = new Set([moisActuelCle()])
  depensesItems.forEach(i => {
    if (!i.recurrente && i.date) set.add(i.date.slice(0, 7))
    if (i.recurrente && i.moisPayes) Object.keys(i.moisPayes).filter(m => i.moisPayes[m]).forEach(m => set.add(m))
  })
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
  const items = itemsPourMois(moisSelectionne)
  const { total, transactions } = calculerReglement(items)

  let messageBalance = 'Ajoute des dépenses pour voir le solde'
  if (items.length > 0) {
    messageBalance = transactions.length === 0
      ? 'Vous êtes à égalité'
      : transactions.map(t => `${t.de} doit ${t.montant.toFixed(2)} $ à ${t.a}`).join('<br>')
  }

  const mois = moisDisponibles()

  let html = `<div class="balance">
    <span>${messageBalance}</span>
    <span class="amount">${total.toFixed(2)} $ au total</span>
  </div>
  <select id="depenses-mois" class="mois-select">
    <option value="tous">Tous les mois</option>
    ${mois.map(m => `<option value="${m}"${m === moisSelectionne ? ' selected' : ''}>${formatMois(m)}</option>`).join('')}
  </select>`

  categoriesDepenses.forEach(cat => {
    const liste = items.filter(i => categorieDe(i) === cat)
    if (liste.length === 0) return
    html += `<div class="section-title">${cat}</div><div class="card">`
    liste.forEach(item => {
      html += `<div class="money-row">
        <div style="flex: 1">
          <div>${escapeHtml(item.desc)}</div>
          <div class="who">payé par ${escapeHtml(item.payeur)}</div>
        </div>
        <span class="amount">${item.montant.toFixed(2)} $</span>
        ${item.instance ? '' : `<button class="remove-btn" data-id="${item.id}">×</button>`}
      </div>`
    })
    html += '</div>'
  })
  if (items.length === 0) html += `<div class="card"><p class="empty">Aucune dépense pour cette période</p></div>`

  html += `<form class="add-row" id="depenses-form" style="flex-wrap: wrap">
    <input id="depenses-desc" placeholder="Description" style="flex-basis: 100%">
    <input id="depenses-montant" placeholder="Montant" type="number" step="0.01">
    <input id="depenses-payeur" placeholder="Payé par" value="${escapeHtml(currentName())}">
    <select id="depenses-categorie">${categoriesDepenses.map(c => `<option value="${c}">${c}</option>`).join('')}</select>
    <button type="submit">+</button>
  </form>`

  const recurrentes = depensesItems.filter(i => i.recurrente)
  html += `<div class="section-title">Dépenses récurrentes</div><div class="card">`
  if (recurrentes.length === 0) html += `<p class="empty">Aucune dépense récurrente</p>`
  recurrentes.forEach(r => {
    const payeCeMois = !!(r.moisPayes && r.moisPayes[moisSelectionne])
    html += `<div class="item-row">
      <input type="checkbox" ${payeCeMois ? 'checked' : ''} data-id="${r.id}" class="recurrente-check"${moisSelectionne === 'tous' ? ' disabled' : ''}>
      <span>${escapeHtml(r.desc)} — ${r.montant.toFixed(2)} $ (${escapeHtml(r.payeur)}) <span class="tag">${escapeHtml(categorieDe(r))}</span></span>
      <button class="recurrente-remove" data-id="${r.id}">×</button>
    </div>`
  })
  html += `</div>
  <form class="add-row" id="recurrente-form" style="flex-wrap: wrap">
    <input id="recurrente-desc" placeholder="Description (ex: Loyer)" style="flex-basis: 100%">
    <input id="recurrente-montant" placeholder="Montant" type="number" step="0.01">
    <input id="recurrente-payeur" placeholder="Payé par" value="${escapeHtml(currentName())}">
    <select id="recurrente-categorie">${categoriesDepenses.map(c => `<option value="${c}">${c}</option>`).join('')}</select>
    <button type="submit">+</button>
  </form>`

  container.innerHTML = html

  document.getElementById('depenses-mois').value = moisSelectionne
  document.getElementById('depenses-mois').onchange = (e) => {
    moisSelectionne = e.target.value
    renderDepenses()
  }
  container.querySelectorAll('.money-row .remove-btn').forEach(el => {
    el.onclick = () => deleteDoc(doc(refDepenses, el.dataset.id))
  })
  container.querySelector('#depenses-form').onsubmit = (e) => {
    e.preventDefault()
    const desc = document.getElementById('depenses-desc').value.trim()
    const montant = parseFloat(document.getElementById('depenses-montant').value)
    const payeur = document.getElementById('depenses-payeur').value.trim()
    const categorie = document.getElementById('depenses-categorie').value
    if (!desc || !montant || !payeur) return
    addDoc(refDepenses, { desc, montant, payeur, categorie, date: new Date().toISOString().slice(0, 10), recurrente: false })
    document.getElementById('depenses-desc').value = ''
    document.getElementById('depenses-montant').value = ''
  }
  container.querySelectorAll('.recurrente-check').forEach(el => {
    el.onchange = () => {
      const r = recurrentes.find(x => x.id === el.dataset.id)
      const moisPayes = Object.assign({}, r.moisPayes || {})
      moisPayes[moisSelectionne] = el.checked
      updateDoc(doc(refDepenses, el.dataset.id), { moisPayes })
    }
  })
  container.querySelectorAll('.recurrente-remove').forEach(el => {
    el.onclick = () => deleteDoc(doc(refDepenses, el.dataset.id))
  })
  container.querySelector('#recurrente-form').onsubmit = (e) => {
    e.preventDefault()
    const desc = document.getElementById('recurrente-desc').value.trim()
    const montant = parseFloat(document.getElementById('recurrente-montant').value)
    const payeur = document.getElementById('recurrente-payeur').value.trim()
    const categorie = document.getElementById('recurrente-categorie').value
    if (!desc || !montant || !payeur) return
    addDoc(refDepenses, { desc, montant, payeur, categorie, recurrente: true, moisPayes: {} })
    document.getElementById('recurrente-desc').value = ''
    document.getElementById('recurrente-montant').value = ''
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
  initFavoris()
  initEpicerie()
  initDepenses()

  document.getElementById('nom-btn').textContent = currentName() || 'Profil'
  if (!currentName()) ouvrirProfil()
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
}
