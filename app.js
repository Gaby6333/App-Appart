import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js'
import {
  getFirestore, collection, onSnapshot, doc, getDocs,
  addDoc as _addDoc, updateDoc as _updateDoc, deleteDoc as _deleteDoc, setDoc as _setDoc
} from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js'
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js'

function erreurEcriture() {
  alert("Erreur : impossible de sauvegarder. Vérifie ta connexion.")
}
function ajouterDoc(ref, data) {
  return _addDoc(ref, data).catch(erreurEcriture)
}
function modifierDoc(ref, data) {
  return _updateDoc(ref, data).catch(erreurEcriture)
}
function supprimerDoc(ref) {
  return _deleteDoc(ref).catch(erreurEcriture)
}
function enregistrerDoc(ref, data, options) {
  return _setDoc(ref, data, options).catch(erreurEcriture)
}

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
const refRecettes = collection(db, 'recettes')
const refRappels = collection(db, 'rappels')
const refConfig = doc(db, 'config', 'general')

const sections = [
  { id: 'accueil', label: 'Accueil', icon: 'ph-house-line' },
  { id: 'checklist', label: 'Checklist', icon: 'ph-check-square-offset' },
  { id: 'repas', label: 'Repas', icon: 'ph-fork-knife' },
  { id: 'epicerie', label: 'Épicerie', icon: 'ph-shopping-cart' },
  { id: 'depenses', label: 'Dépenses', icon: 'ph-wallet' }
]

const categoriesChecklist = [
  { cat: 'Chambre', icon: 'ph-bed' },
  { cat: 'Salle de bain', icon: 'ph-bathtub' },
  { cat: 'Cuisine', icon: 'ph-cooking-pot' },
  { cat: 'Salon', icon: 'ph-armchair' },
  { cat: 'Tout', icon: 'ph-house-line' },
  { cat: 'Nourriture', icon: 'ph-bowl-food' }
]
const categoriesDepenses = [
  { cat: 'Loyer', icon: 'ph-house-line' },
  { cat: 'Épicerie', icon: 'ph-shopping-cart' },
  { cat: 'Internet/Téléphone', icon: 'ph-wifi-high' },
  { cat: 'Restaurant', icon: 'ph-fork-knife' },
  { cat: 'Autre', icon: 'ph-receipt' }
]
const frequences = { hebdo: 'chaque semaine', mensuel: 'chaque mois' }
const noms_mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
const abrev_mois = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc']
const noms_jours_courts = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam']
const noms_jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
const moments = [
  { id: 'dejeuner', label: 'Déjeuner' },
  { id: 'diner', label: 'Dîner' },
  { id: 'souper', label: 'Souper' }
]

const items_depart = [
  ['Chambre', 'Lit et matelas'], ['Chambre', 'Couverture et draps'], ['Chambre', 'Oreillers'],
  ['Chambre', 'Table de chevet'], ['Chambre', 'Lumière'], ['Chambre', 'Cadran'], ['Chambre', 'Armoire'],
  ['Chambre', 'Cintres'], ['Chambre', 'Miroir'], ['Chambre', 'Store et rideaux'], ['Chambre', 'Panier à linge'],
  ['Salle de bain', 'Serviettes de corps et à main'], ['Salle de bain', 'Produits nettoyants salle de bain'],
  ['Salle de bain', 'Produit pour laveuse'], ['Salle de bain', 'Savon à main'],
  ['Salle de bain', 'Rideau de douche et tringle'], ['Salle de bain', 'Tapis de bain'],
  ['Salle de bain', 'Papier de toilette'],
  ['Cuisine', 'Grille-pain, cafetière ou micro-onde'], ['Cuisine', 'Vaisselle (bols et assiettes)'],
  ['Cuisine', 'Verres'], ['Cuisine', 'Ustensiles'], ['Cuisine', 'Chaudrons'], ['Cuisine', 'Poêlons'],
  ['Cuisine', 'Planches à découper'], ['Cuisine', 'Contenants de conservation'],
  ['Cuisine', 'Produit nettoyant vaisselle'], ['Cuisine', 'Sacs à poubelle'],
  ['Salon', 'Divan'], ['Salon', 'Tapis'], ['Salon', 'Télé'], ['Salon', 'Table à café'], ['Salon', "Lampes d'appoint"],
  ['Tout', 'Poubelle'], ['Tout', 'Balai, vadrouille, aspirateur'], ['Tout', 'Trousse de premiers soins'],
  ['Tout', 'Ampoules de rechange'],
  ['Nourriture', 'Épices de base'], ['Nourriture', 'Huile à cuisson'], ['Nourriture', 'Café ou thé']
]

const rappels_depart = [
  { nom: 'Poubelles', quand: 'mardi, 19 h', icon: 'ph-trash', actif: true },
  { nom: 'Loyer', quand: 'le 1er de chaque mois, 9 h', icon: 'ph-house-line', actif: true },
  { nom: 'Planifier les repas', quand: 'dimanche, 11 h', icon: 'ph-fork-knife', actif: true }
]

// — utilitaires —

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str == null ? '' : str
  return div.innerHTML
}

function argent(n) {
  const [ent, dec] = (Math.round(n * 100) / 100).toFixed(2).split('.')
  return ent.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f') + ',' + dec + ' $'
}

function iconeChecklist(cat) {
  const trouve = categoriesChecklist.find(c => c.cat === cat)
  return trouve ? trouve.icon : 'ph-package'
}

function formatDateISO(d) {
  const mois = String(d.getMonth() + 1).padStart(2, '0')
  const jour = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mois}-${jour}`
}

function moisActuelCle() {
  return formatDateISO(new Date()).slice(0, 7)
}

function formatMois(cle) {
  const [an, mois] = cle.split('-')
  return `${noms_mois[parseInt(mois, 10) - 1]} ${an}`
}

// — état local —

let checklistItems = []
let tachesItems = []
let epicerieItems = []
let depensesItems = []
let repasItems = []
let recettes = []
let rappels = []
let dateCible = ''
let pret = false

let ongletActuel = 'accueil'
let checklistOuvert = null
let repasOuvert = null
let semaineDebut = lundiDeCetteSemaine(new Date())
let moisSelectionne = moisActuelCle()
let calMois = moisActuelCle()
let calJourOuvert = null
let tacheOuverte = null
let tacheFormOuvert = false
let recOuvert = null
let recAjoutOuvert = false

function currentName() {
  return localStorage.getItem('app-appart-nom') || ''
}

// — profil —

function ouvrirProfil() {
  document.getElementById('profil-overlay').style.display = 'flex'
}

function fermerProfil() {
  document.getElementById('profil-overlay').style.display = 'none'
}

document.querySelectorAll('.profil-bouton').forEach(btn => {
  btn.onclick = () => {
    localStorage.setItem('app-appart-nom', btn.dataset.nom)
    fermerProfil()
    rendre()
  }
})

document.getElementById('profil-overlay').onclick = (e) => {
  if (e.target.id === 'profil-overlay' && currentName()) fermerProfil()
}

// — navigation —

function goTo(id) {
  ongletActuel = id
  sections.forEach(s => {
    document.getElementById('section-' + s.id).classList.toggle('active', s.id === id)
  })
  document.querySelectorAll('#tabbar button').forEach(b => {
    const actif = b.dataset.id === id
    b.classList.toggle('active', actif)
    const i = b.querySelector('i')
    i.className = (actif ? 'ph-fill ' : 'ph ') + b.dataset.icon
  })
  window.scrollTo(0, 0)
}

function setupNav() {
  const nav = document.getElementById('tabbar')
  nav.innerHTML = sections.map(s => `
    <button type="button" data-id="${s.id}" data-icon="${s.icon}">
      <i class="ph ${s.icon}"></i>
      <span>${s.label}</span>
      ${s.id === 'epicerie' ? '<span class="badge" id="badge-epicerie" style="display:none"></span>' : ''}
    </button>`).join('')
  nav.querySelectorAll('button').forEach(b => {
    b.onclick = () => goTo(b.dataset.id)
  })
  goTo('accueil')
}

function majBadge() {
  const badge = document.getElementById('badge-epicerie')
  if (!badge) return
  const n = epicerieItems.filter(i => !i.fait).length
  badge.textContent = n
  badge.style.display = n > 0 ? '' : 'none'
}

// — en-tête réutilisable —

function enTete(titre, sous, actions) {
  return `<div class="head">
    <div>
      <h1>${titre}</h1>
      ${sous ? `<div class="sub">${sous}</div>` : ''}
    </div>
    <div class="head-actions">${actions || ''}</div>
  </div>`
}

function boutonsEnTete() {
  return `
  <button type="button" class="icon-btn" data-action="rappels" aria-label="Rappels"><i class="ph ph-bell"></i></button>
  <button type="button" class="icon-btn" data-action="profil" aria-label="Changer de profil">${escapeHtml(currentName().charAt(0) || '?')}</button>`
}

function brancherEnTete(container) {
  const rappelsBtn = container.querySelector('[data-action="rappels"]')
  if (rappelsBtn) rappelsBtn.onclick = ouvrirRappels
  const profilBtn = container.querySelector('[data-action="profil"]')
  if (profilBtn) profilBtn.onclick = ouvrirProfil
}

// — accueil —

function joursRestants() {
  if (!dateCible) return null
  return Math.ceil((new Date(dateCible) - new Date(new Date().toDateString())) / 86400000)
}

function reglement() {
  const items = itemsPourMois(moisActuelCle())
  return calculerReglement(items)
}

function renderAccueil() {
  const container = document.getElementById('section-accueil')
  const maintenant = new Date()
  const faits = checklistItems.filter(i => i.fait).length
  const total = checklistItems.length || 1
  const pct = Math.round((faits / total) * 100)
  const jours = joursRestants()
  const aFaire = tachesItems.filter(t => !t.fait && tacheTombeLe(t, maintenant))
  const repasAujourdhui = repasItems.find(r => r.id === formatDateISO(maintenant)) || {}
  const souper = repasAujourdhui.souper && repasAujourdhui.souper.texte
  const epicerieActifs = epicerieItems.filter(i => !i.fait)
  const { transactions } = reglement()
  const t0 = transactions[0]

  let html = `<div class="head">
    <div>
      <div class="kicker">${noms_jours[maintenant.getDay()]} ${maintenant.getDate()} ${noms_mois[maintenant.getMonth()]}</div>
      <h1>Aujourd'hui</h1>
    </div>
    <div class="head-actions">${boutonsEnTete()}</div>
  </div>
  <div class="body">
    <div class="hero">
      <div class="glow"></div>
      <div class="hero-top">
        <div>
          <div class="big">${jours === null ? '—' : (jours < 0 ? 'C\'est fait' : jours)}</div>
          <div class="legend">${jours === null ? 'ajoute la date du déménagement' : (jours > 0 ? 'jours avant le déménagement' : (jours === 0 ? "c'est aujourd'hui !" : 'le déménagement est passé'))}</div>
        </div>
        <input type="date" id="date-cible" value="${dateCible || ''}">
      </div>
      <div class="progress"><span style="width:${pct}%"></span></div>
      <div class="progress-legend"><span>${faits} des ${checklistItems.length} items prêts</span><span>${pct} %</span></div>
    </div>

    <div class="section-title"><span>Calendrier</span></div>
    <div class="card card-pad">
      <div class="cal-head">
        <button type="button" class="icon-btn" id="cal-prec" aria-label="Mois précédent"><i class="ph ph-caret-left"></i></button>
        <div class="cal-mois">${formatMois(calMois)}</div>
        <button type="button" class="icon-btn" id="cal-suiv" aria-label="Mois suivant"><i class="ph ph-caret-right"></i></button>
      </div>
      <div class="cal-semaine">${noms_jours_courts.slice(1).concat(noms_jours_courts[0]).map(j => `<span>${j}</span>`).join('')}</div>
      <div class="cal-grid">`

  joursDuMoisCalendrier(calMois).forEach(d => {
    if (!d) {
      html += '<div class="cal-jour vide"></div>'
      return
    }
    const iso = formatDateISO(d)
    const { aRepas, taches, recurrentes, rappelsJour } = contenuDuJour(d)
    const aPaiement = recurrentes.some(r => !(r.moisPayes && r.moisPayes[iso.slice(0, 7)]))
    const estAujourdhui = iso === formatDateISO(maintenant)
    html += `<button type="button" class="cal-jour${estAujourdhui ? ' today' : ''}${iso === calJourOuvert ? ' on' : ''}" data-jour="${iso}" aria-label="${noms_jours[d.getDay()]} ${d.getDate()}">
      <span class="n">${d.getDate()}</span>
      <span class="cal-dots">
        ${aRepas ? '<span class="cal-dot repas"></span>' : ''}
        ${taches.length ? '<span class="cal-dot tache"></span>' : ''}
        ${aPaiement ? '<span class="cal-dot paiement"></span>' : ''}
        ${rappelsJour.length ? '<span class="cal-dot rappel"></span>' : ''}
      </span>
    </button>`
  })

  html += `</div>
      <div class="cal-legende">
        <span><span class="cal-dot repas"></span>Repas</span>
        <span><span class="cal-dot tache"></span>Tâche</span>
        <span><span class="cal-dot paiement"></span>Paiement</span>
        <span><span class="cal-dot rappel"></span>Rappel</span>
      </div>
    </div>

    <div class="section-title"><span>À faire aujourd'hui</span><span>${aFaire.length}</span></div>
    <div class="card">`

  if (aFaire.length === 0 && !souper) {
    html += '<p class="empty">Rien de prévu aujourd\'hui</p>'
  }
  aFaire.forEach(t => {
    const meta = [labelJourTache(t), t.dernierFaitPar ? 'dernier : ' + escapeHtml(t.dernierFaitPar) : null].filter(Boolean).join(' · ')
    html += `<div class="row">
      <button type="button" class="check" data-tache="${t.id}" aria-label="${escapeHtml(t.texte)} : marquer fait"><i class="ph-fill ph-check"></i></button>
      <div class="main"><div class="titre">${escapeHtml(t.texte)}</div>${meta ? `<div class="meta">${meta}</div>` : ''}</div>
      <button type="button" class="ghost-btn" data-detail-tache="${t.id}" aria-label="${tacheOuverte === t.id ? 'Fermer les détails' : 'Voir les détails'}"><i class="ph ph-${tacheOuverte === t.id ? 'caret-up' : 'caret-down'}"></i></button>
      <button type="button" class="ghost-btn" data-suppr-tache="${t.id}" aria-label="Supprimer ${escapeHtml(t.texte)}"><i class="ph ph-x"></i></button>
    </div>`
    if (tacheOuverte === t.id) {
      html += `<div class="edit-panel">
        <select class="input" id="tache-edit-recurrence-${t.id}">
          <option value="aucune"${!t.recurrence || t.recurrence === 'aucune' ? ' selected' : ''}>Une fois</option>
          <option value="hebdo"${t.recurrence === 'hebdo' ? ' selected' : ''}>Chaque semaine</option>
          <option value="mensuel"${t.recurrence === 'mensuel' ? ' selected' : ''}>Chaque mois</option>
        </select>
        <input class="input" id="tache-edit-jour-date-${t.id}" type="date" value="${!t.recurrence || t.recurrence === 'aucune' ? (t.jour || '') : ''}" style="display:${!t.recurrence || t.recurrence === 'aucune' ? '' : 'none'}">
        <select class="input" id="tache-edit-jour-semaine-${t.id}" style="display:${t.recurrence === 'hebdo' ? '' : 'none'}">
          ${noms_jours.map((n, i) => `<option value="${i}"${t.recurrence === 'hebdo' && Number(t.jour) === i ? ' selected' : ''}>${n}</option>`).join('')}
        </select>
        <input class="input" id="tache-edit-jour-mois-${t.id}" type="number" min="1" max="31" placeholder="Jour du mois" value="${t.recurrence === 'mensuel' ? (t.jour || '') : ''}" style="display:${t.recurrence === 'mensuel' ? '' : 'none'}">
        <div class="edit-actions"><button type="button" class="btn btn-sm" data-save-tache="${t.id}">Enregistrer</button></div>
      </div>`
    }
  })
  if (souper) {
    html += `<div class="row">
      <div class="pill-icon"><i class="ph ph-fork-knife"></i></div>
      <div class="main"><div class="titre">Souper : ${escapeHtml(souper)}</div><div class="meta">planifié pour ce soir</div></div>
    </div>`
  }

  html += `</div>
    ${tacheFormOuvert ? `<div class="form-grid">
      <input class="input full" id="tache-texte" placeholder="Nouvelle tâche">
      <select class="input" id="tache-recurrence">
        <option value="aucune">Une fois</option>
        <option value="hebdo">Chaque semaine</option>
        <option value="mensuel">Chaque mois</option>
      </select>
      <input class="input" id="tache-jour-date" type="date">
      <select class="input" id="tache-jour-semaine" style="display:none">
        ${noms_jours.map((n, i) => `<option value="${i}">${n}</option>`).join('')}
      </select>
      <input class="input" id="tache-jour-mois" type="number" min="1" max="31" placeholder="Jour du mois" style="display:none">
      <button type="button" class="btn" id="tache-ajouter"><i class="ph ph-plus"></i></button>
    </div>` : `<button type="button" class="btn btn-quiet btn-block" id="tache-form-ouvrir"><i class="ph ph-plus"></i>Ajouter une tâche</button>`}

    <div class="tiles">
      <button type="button" class="tile" data-go="depenses">
        <div class="label"><i class="ph ph-wallet"></i>Solde</div>
        <div class="valeur">${t0 ? argent(t0.montant) : '0,00 $'}</div>
        <div class="sous accent">${t0 ? `${escapeHtml(t0.de)} doit à ${escapeHtml(t0.a)}` : 'vous êtes à égalité'}</div>
      </button>
      <button type="button" class="tile" data-go="epicerie">
        <div class="label"><i class="ph ph-shopping-cart"></i>Épicerie</div>
        <div class="valeur">${epicerieActifs.length}</div>
        <div class="sous">à acheter</div>
      </button>
    </div>
  </div>`

  container.innerHTML = html
  brancherEnTete(container)
  container.querySelector('#date-cible').onchange = (e) => enregistrerDoc(refConfig, { dateCible: e.target.value }, { merge: true })

  container.querySelector('#cal-prec').onclick = () => { calMois = decalerMois(calMois, -1); renderAccueil() }
  container.querySelector('#cal-suiv').onclick = () => { calMois = decalerMois(calMois, 1); renderAccueil() }
  container.querySelectorAll('[data-jour]').forEach(el => {
    el.onclick = () => ouvrirJour(el.dataset.jour)
  })

  container.querySelectorAll('[data-tache]').forEach(el => {
    el.onclick = () => cocherTache(el.dataset.tache)
  })
  container.querySelectorAll('[data-detail-tache]').forEach(el => {
    el.onclick = () => {
      tacheOuverte = tacheOuverte === el.dataset.detailTache ? null : el.dataset.detailTache
      renderAccueil()
    }
  })
  container.querySelectorAll('[data-suppr-tache]').forEach(el => {
    el.onclick = () => {
      if (confirm('Supprimer cette tâche ?')) supprimerDoc(doc(refTaches, el.dataset.supprTache))
    }
  })
  container.querySelectorAll('[data-save-tache]').forEach(el => {
    el.onclick = () => {
      const id = el.dataset.saveTache
      const recurrence = container.querySelector(`#tache-edit-recurrence-${id}`).value
      let jour = ''
      if (recurrence === 'aucune') jour = container.querySelector(`#tache-edit-jour-date-${id}`).value
      else if (recurrence === 'hebdo') jour = container.querySelector(`#tache-edit-jour-semaine-${id}`).value
      else if (recurrence === 'mensuel') jour = container.querySelector(`#tache-edit-jour-mois-${id}`).value.trim()
      modifierDoc(doc(refTaches, id), { recurrence, jour })
      tacheOuverte = null
      renderAccueil()
    }
  })
  if (tacheOuverte) {
    const sel = container.querySelector(`#tache-edit-recurrence-${tacheOuverte}`)
    if (sel) {
      sel.onchange = () => {
        container.querySelector(`#tache-edit-jour-date-${tacheOuverte}`).style.display = sel.value === 'aucune' ? '' : 'none'
        container.querySelector(`#tache-edit-jour-semaine-${tacheOuverte}`).style.display = sel.value === 'hebdo' ? '' : 'none'
        container.querySelector(`#tache-edit-jour-mois-${tacheOuverte}`).style.display = sel.value === 'mensuel' ? '' : 'none'
      }
    }
  }

  container.querySelectorAll('[data-go]').forEach(el => {
    el.onclick = () => goTo(el.dataset.go)
  })

  const formOuvrir = container.querySelector('#tache-form-ouvrir')
  if (formOuvrir) {
    formOuvrir.onclick = () => { tacheFormOuvert = true; renderAccueil() }
  }
  const recSelect = container.querySelector('#tache-recurrence')
  if (recSelect) {
    const jourDate = container.querySelector('#tache-jour-date')
    const jourSemaine = container.querySelector('#tache-jour-semaine')
    const jourMois = container.querySelector('#tache-jour-mois')
    recSelect.onchange = () => {
      jourDate.style.display = recSelect.value === 'aucune' ? '' : 'none'
      jourSemaine.style.display = recSelect.value === 'hebdo' ? '' : 'none'
      jourMois.style.display = recSelect.value === 'mensuel' ? '' : 'none'
    }
    const ajouterTache = () => {
      const texte = container.querySelector('#tache-texte').value.trim()
      if (!texte) return
      const recurrence = recSelect.value
      let jour = ''
      if (recurrence === 'aucune') jour = jourDate.value
      else if (recurrence === 'hebdo') jour = jourSemaine.value
      else if (recurrence === 'mensuel') jour = jourMois.value.trim()
      ajouterDoc(refTaches, { texte, recurrence, jour, fait: false })
      tacheFormOuvert = false
      renderAccueil()
    }
    container.querySelector('#tache-ajouter').onclick = ajouterTache
    container.querySelector('#tache-texte').onkeydown = (e) => { if (e.key === 'Enter') ajouterTache() }
  }
}

// — checklist —

function renderChecklist() {
  const container = document.getElementById('section-checklist')
  const faits = checklistItems.filter(i => i.fait).length
  const total = checklistItems.length
  const pct = total ? Math.round((faits / total) * 100) : 0

  let html = enTete('Checklist', `${faits} / ${total} · ${total - faits} items restants`, boutonsEnTete()) + '<div class="body">'

  categoriesChecklist.forEach(({ cat, icon }) => {
    const liste = checklistItems.filter(i => i.categorie === cat)
    if (liste.length === 0) return
    const f = liste.filter(i => i.fait).length
    html += `<div class="card card-pad">
      <div class="row" style="padding:0 0 12px;border:none;min-height:0">
        <div class="pill-icon" style="background:transparent;color:var(--accent-light);width:auto;height:auto"><i class="ph ${icon}" style="font-size:20px"></i></div>
        <div class="main" style="font-size:16px;font-weight:500">${cat}</div>
        <div class="meta">${f} / ${liste.length}</div>
      </div>
      <div class="progress" style="margin-top:0"><span style="width:${Math.round((f / liste.length) * 100)}%"></span></div>
      <div style="margin-top:6px">`
    liste.forEach(item => {
      const badges = [item.lien ? 'lien' : '', item.note ? 'note' : ''].filter(Boolean).join(' · ')
      html += `<div class="row${item.fait ? ' done' : ''}" style="padding:10px 0;min-height:48px">
        <button type="button" class="check${item.fait ? ' on' : ''}" data-item="${item.id}" aria-label="${escapeHtml(item.texte)} : ${item.fait ? 'marquer non fait' : 'marquer fait'}"><i class="ph-fill ph-check"></i></button>
        <div class="main">
          <div class="titre" style="font-size:14.5px">${escapeHtml(item.texte)}</div>
          ${item.achetePar || badges ? `<div class="meta">${[item.achetePar ? 'acheté par ' + escapeHtml(item.achetePar) : '', badges].filter(Boolean).join(' · ')}</div>` : ''}
        </div>
        <button type="button" class="ghost-btn" data-detail="${item.id}" aria-label="${checklistOuvert === item.id ? 'Fermer les détails' : 'Voir les détails'}"><i class="ph ph-${checklistOuvert === item.id ? 'caret-up' : 'caret-down'}"></i></button>
        <button type="button" class="ghost-btn" data-suppr="${item.id}" aria-label="Supprimer ${escapeHtml(item.texte)}"><i class="ph ph-x"></i></button>
      </div>`
      if (checklistOuvert === item.id) {
        html += `<div class="edit-panel">
          ${item.lien ? `<a href="${escapeHtml(item.lien)}" target="_blank" rel="noopener"><i class="ph ph-link-simple"></i> ouvrir le lien</a>` : ''}
          <input class="input item-lien" type="url" placeholder="Lien (page du produit)" value="${escapeHtml(item.lien)}">
          <textarea class="input item-note" placeholder="Note">${escapeHtml(item.note)}</textarea>
          <div class="edit-actions"><button type="button" class="btn btn-sm" data-save="${item.id}">Enregistrer</button></div>
        </div>`
      }
    })
    html += '</div></div>'
  })

  html += `<div class="form-row">
    <select class="input" id="checklist-categorie">${categoriesChecklist.map(c => `<option value="${c.cat}">${c.cat}</option>`).join('')}</select>
    <input class="input" id="checklist-texte" placeholder="Ajouter un item">
    <button type="button" class="btn" id="checklist-ajouter"><i class="ph ph-plus"></i></button>
  </div>
  <div class="progress-legend"><span>Progression totale</span><span>${pct} %</span></div>
  </div>`

  container.innerHTML = html
  brancherEnTete(container)
  container.querySelectorAll('[data-item]').forEach(el => {
    el.onclick = () => {
      const item = checklistItems.find(i => i.id === el.dataset.item)
      modifierDoc(doc(refChecklist, item.id), { fait: !item.fait, achetePar: !item.fait ? currentName() : null })
    }
  })
  container.querySelectorAll('[data-suppr]').forEach(el => {
    el.onclick = () => {
      if (confirm('Supprimer cet item de la checklist ?')) supprimerDoc(doc(refChecklist, el.dataset.suppr))
    }
  })
  container.querySelectorAll('[data-detail]').forEach(el => {
    el.onclick = () => {
      checklistOuvert = checklistOuvert === el.dataset.detail ? null : el.dataset.detail
      renderChecklist()
    }
  })
  container.querySelectorAll('[data-save]').forEach(el => {
    el.onclick = () => {
      const panneau = el.closest('.edit-panel')
      modifierDoc(doc(refChecklist, el.dataset.save), {
        lien: panneau.querySelector('.item-lien').value.trim(),
        note: panneau.querySelector('.item-note').value.trim()
      })
      checklistOuvert = null
      renderChecklist()
    }
  })
  const ajouter = () => {
    const texte = container.querySelector('#checklist-texte').value.trim()
    if (!texte) return
    ajouterDoc(refChecklist, { texte, categorie: container.querySelector('#checklist-categorie').value, fait: false })
    container.querySelector('#checklist-texte').value = ''
  }
  container.querySelector('#checklist-ajouter').onclick = ajouter
  container.querySelector('#checklist-texte').onkeydown = (e) => { if (e.key === 'Enter') ajouter() }
}

// — tâches (dans l'accueil et la checklist des rappels) —

function cocherTache(id) {
  const item = tachesItems.find(i => i.id === id)
  if (!item) return
  if (item.recurrence && item.recurrence !== 'aucune') {
    modifierDoc(doc(refTaches, id), { fait: false, dernierFaitPar: currentName(), dernierFait: formatDateISO(new Date()) })
  } else {
    modifierDoc(doc(refTaches, id), { fait: !item.fait, faitPar: !item.fait ? currentName() : null })
  }
}

// une tâche sans jour assigné reste "toujours active" (comportement historique, avant l'ajout du calendrier)
function tacheTombeLe(t, date) {
  if (t.jour === undefined || t.jour === null || t.jour === '') return true
  if (t.recurrence === 'hebdo') return date.getDay() === Number(t.jour)
  if (t.recurrence === 'mensuel') return date.getDate() === Number(t.jour)
  return formatDateISO(date) === t.jour
}

function labelJourTache(t) {
  if (t.recurrence === 'hebdo' && (t.jour || t.jour === 0)) return 'chaque ' + noms_jours[Number(t.jour)]
  if (t.recurrence === 'mensuel' && t.jour) return 'le ' + t.jour + ' de chaque mois'
  if (t.recurrence === 'aucune' && t.jour) {
    const d = new Date(t.jour + 'T00:00:00')
    return `${noms_jours[d.getDay()]} ${d.getDate()} ${abrev_mois[d.getMonth()]}`
  }
  return t.recurrence && frequences[t.recurrence] ? frequences[t.recurrence] : ''
}

// — calendrier —

function recurrenteTombeLe(r, date) {
  if (!r.jourPaiement) return false
  return Number(r.jourPaiement) === date.getDate()
}

function correspondALaDate(quand, date) {
  if (!quand) return false
  const texte = quand.toLowerCase()
  if (texte.includes(noms_jours[date.getDay()])) return true
  const jourMois = date.getDate()
  if (jourMois === 1 && /\b1er\b/.test(texte)) return true
  return new RegExp(`\\b${jourMois}\\b`).test(texte)
}

function joursDuMoisCalendrier(cle) {
  const [an, mois] = cle.split('-').map(Number)
  const premier = new Date(an, mois - 1, 1)
  const dernier = new Date(an, mois, 0)
  const decalage = (premier.getDay() + 6) % 7
  const jours = []
  for (let i = 0; i < decalage; i++) jours.push(null)
  for (let j = 1; j <= dernier.getDate(); j++) jours.push(new Date(an, mois - 1, j))
  return jours
}

function decalerMois(cle, delta) {
  const [an, mois] = cle.split('-').map(Number)
  const d = new Date(an, mois - 1 + delta, 1)
  return formatDateISO(d).slice(0, 7)
}

function contenuDuJour(date) {
  const iso = formatDateISO(date)
  const repasJour = repasItems.find(r => r.id === iso) || {}
  const aRepas = moments.some(m => repasJour[m.id] && repasJour[m.id].texte)
  const taches = tachesItems.filter(t => !t.fait && tacheTombeLe(t, date))
  const recurrentes = depensesItems.filter(r => r.recurrente && recurrenteTombeLe(r, date))
  const rappelsJour = rappels.filter(r => r.actif && correspondALaDate(r.quand, date))
  return { iso, repasJour, aRepas, taches, recurrentes, rappelsJour }
}

function fermerJour() {
  calJourOuvert = null
  document.getElementById('jour-overlay').style.display = 'none'
}

function ouvrirJour(iso) {
  calJourOuvert = iso
  const el = document.getElementById('jour-overlay')
  el.style.display = 'flex'
  const date = new Date(iso + 'T00:00:00')
  const { repasJour, taches, recurrentes, rappelsJour } = contenuDuJour(date)
  const cleMois = iso.slice(0, 7)

  el.innerHTML = `<div class="sheet-bas">
    <div class="sheet-head">
      <div><div class="titre">${noms_jours[date.getDay()]} ${date.getDate()} ${noms_mois[date.getMonth()]}</div><div class="meta">Récap de la journée</div></div>
      <button type="button" class="icon-btn" id="fermer-jour" aria-label="Fermer"><i class="ph ph-x"></i></button>
    </div>

    <div class="section-title"><span>Repas</span></div>
    <div class="card card-pad">
      ${moments.map(m => {
        const r = repasJour[m.id]
        return `<div class="row" style="padding:8px 0;min-height:auto">
          <div class="main"><div class="titre" style="font-size:13.5px">${m.label}</div></div>
          <div class="meta">${r && r.texte ? escapeHtml(r.texte) : '—'}</div>
        </div>`
      }).join('')}
    </div>

    <div class="section-title"><span>Tâches</span><span>${taches.length}</span></div>
    <div class="card">
      ${taches.length === 0 ? '<p class="empty">Rien à faire ce jour-là</p>' : taches.map(t => `
        <div class="row">
          <button type="button" class="check" data-jour-tache="${t.id}" aria-label="${escapeHtml(t.texte)} : marquer fait"><i class="ph-fill ph-check"></i></button>
          <div class="main"><div class="titre">${escapeHtml(t.texte)}</div></div>
        </div>`).join('')}
    </div>

    <div class="section-title"><span>Paiements</span></div>
    <div class="card">
      ${recurrentes.length === 0 ? '<p class="empty">Rien à payer ce jour-là</p>' : ''}
      ${recurrentes.map(r => {
        const paye = !!(r.moisPayes && r.moisPayes[cleMois])
        return `<div class="row">
          <button type="button" class="check${paye ? ' on' : ''}" data-jour-rec="${r.id}" aria-label="${escapeHtml(r.desc)} : ${paye ? 'marquer non payé' : 'marquer payé'}"><i class="ph-fill ph-check"></i></button>
          <div class="main"><div class="titre">${escapeHtml(r.desc)}</div><div class="meta">${argent(r.montant)}</div></div>
        </div>`
      }).join('')}
    </div>

    <div class="section-title"><span>Rappels</span></div>
    <div class="card">
      ${rappelsJour.length === 0 ? '<p class="empty">Aucun rappel ce jour-là</p>' : rappelsJour.map(r => `
        <div class="row">
          <div class="pill-icon" style="background:transparent;color:var(--accent-light)"><i class="ph ${r.icon || 'ph-bell'}"></i></div>
          <div class="main"><div class="titre" style="font-size:14.5px">${escapeHtml(r.nom)}</div><div class="meta">${escapeHtml(r.quand)}</div></div>
        </div>`).join('')}
    </div>
  </div>`

  el.onclick = (e) => { if (e.target.id === 'jour-overlay') fermerJour() }
  el.querySelector('#fermer-jour').onclick = fermerJour
  el.querySelectorAll('[data-jour-tache]').forEach(b => {
    b.onclick = () => cocherTache(b.dataset.jourTache)
  })
  el.querySelectorAll('[data-jour-rec]').forEach(b => {
    b.onclick = () => {
      const r = recurrentes.find(x => x.id === b.dataset.jourRec)
      const moisPayes = Object.assign({}, r.moisPayes || {})
      moisPayes[cleMois] = !moisPayes[cleMois]
      modifierDoc(doc(refDepenses, r.id), { moisPayes })
    }
  })
}

// — repas —

function lundiDeCetteSemaine(date) {
  const d = new Date(date)
  const jour = d.getDay()
  d.setDate(d.getDate() + (jour === 0 ? -6 : 1 - jour))
  d.setHours(0, 0, 0, 0)
  return d
}

function envoyerAEpicerie(lignes) {
  lignes.map(l => l.trim()).filter(Boolean).forEach(ligne => {
    const dejaLa = epicerieItems.some(i => !i.fait && i.texte.toLowerCase() === ligne.toLowerCase())
    if (!dejaLa) ajouterDoc(refEpicerie, { texte: ligne, fait: false })
  })
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
  const jourSel = repasOuvert ? repasOuvert.split('|')[0] : (jours.some(d => formatDateISO(d) === aujourdhui) ? aujourdhui : formatDateISO(jours[0]))
  const jourItem = repasItems.find(r => r.id === jourSel) || {}

  let html = enTete('Repas', `${jours[0].getDate()} au ${jours[6].getDate()} ${noms_mois[jours[6].getMonth()]}`, `
    <button type="button" class="icon-btn" id="semaine-prec" aria-label="Semaine précédente"><i class="ph ph-caret-left"></i></button>
    <button type="button" class="icon-btn" id="semaine-suiv" aria-label="Semaine suivante"><i class="ph ph-caret-right"></i></button>`)

  html += '<div class="body"><div class="semaine">'
  jours.forEach(d => {
    const iso = formatDateISO(d)
    html += `<button type="button" class="jour-btn${iso === jourSel ? ' on' : ''}" data-jour="${iso}">
      <div class="j">${noms_jours_courts[d.getDay()]}</div><div class="n">${d.getDate()}</div>
    </button>`
  })
  html += '</div><div class="card">'

  moments.forEach(m => {
    const repasMoment = jourItem[m.id]
    const texte = repasMoment && repasMoment.texte
    const cle = jourSel + '|' + m.id
    html += `<div class="moment${m.id === 'souper' ? ' souper' : ''}" data-moment="${cle}">
      <span class="label">${m.label}</span>
      <span class="texte${texte ? '' : ' vide'}">${texte ? escapeHtml(texte) : 'Ajouter un repas'}</span>
      ${texte && repasMoment.ingredients ? `<button type="button" class="btn btn-sm btn-quiet" data-envoyer="${cle}"><i class="ph ph-shopping-cart"></i>Épicerie</button>` : '<i class="ph ph-plus" style="color:#6b6f85"></i>'}
    </div>`
    if (repasOuvert === cle) {
      html += `<div class="edit-panel">
        <input class="input" id="repas-texte" placeholder="Nom du repas" value="${escapeHtml(repasMoment ? repasMoment.texte : '')}">
        <textarea class="input" id="repas-ingredients" placeholder="Ingrédients, un par ligne">${escapeHtml(repasMoment ? repasMoment.ingredients : '')}</textarea>
        <div class="edit-actions">
          <button type="button" class="btn btn-sm" data-save-repas="${cle}">Enregistrer</button>
          <button type="button" class="btn btn-sm btn-quiet" data-save-recette="${cle}"><i class="ph ph-bookmark-simple"></i>Sauver la recette</button>
          <button type="button" class="btn btn-sm btn-quiet" data-clear-repas="${cle}">Effacer</button>
        </div>
      </div>`
    }
  })

  html += '</div><div class="section-title"><span>Recettes sauvegardées</span></div>'
  if (recettes.length === 0) {
    html += '<div class="card"><p class="empty">Enregistre un repas comme recette pour le réutiliser</p></div>'
  } else {
    html += '<div class="recettes">'
    recettes.slice(0, 3).forEach(r => {
      const n = (r.ingredients || '').split('\n').filter(l => l.trim()).length
      html += `<button type="button" class="recette" data-recette="${r.id}">
        <i class="ph ph-bowl-food"></i>
        <div class="nom">${escapeHtml(r.texte)}</div>
        <div class="n">${n} ingrédients</div>
      </button>`
    })
    html += '</div>'
    if (recettes.length > 3) {
      html += '<div class="chips">' + recettes.slice(3).map(r => `<span class="chip" data-recette="${r.id}">${escapeHtml(r.texte)}<span class="x" data-suppr-recette="${r.id}">×</span></span>`).join('') + '</div>'
    }
  }
  html += '</div>'

  container.innerHTML = html
  brancherEnTete(container)
  container.querySelector('#semaine-prec').onclick = () => {
    semaineDebut.setDate(semaineDebut.getDate() - 7)
    repasOuvert = null
    renderRepas()
  }
  container.querySelector('#semaine-suiv').onclick = () => {
    semaineDebut.setDate(semaineDebut.getDate() + 7)
    repasOuvert = null
    renderRepas()
  }
  container.querySelectorAll('[data-jour]').forEach(el => {
    el.onclick = () => {
      repasOuvert = el.dataset.jour + '|souper'
      renderRepas()
    }
  })
  container.querySelectorAll('[data-moment]').forEach(el => {
    el.onclick = (e) => {
      if (e.target.closest('[data-envoyer]')) return
      repasOuvert = repasOuvert === el.dataset.moment ? null : el.dataset.moment
      renderRepas()
    }
  })
  container.querySelectorAll('[data-envoyer]').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation()
      const [dateStr, moment] = el.dataset.envoyer.split('|')
      const item = repasItems.find(r => r.id === dateStr) || {}
      const m = item[moment]
      if (m && m.ingredients) {
        envoyerAEpicerie(m.ingredients.split('\n'))
        goTo('epicerie')
      }
    }
  })
  container.querySelectorAll('[data-save-repas]').forEach(el => {
    el.onclick = () => {
      const [dateStr, moment] = el.dataset.saveRepas.split('|')
      const texte = container.querySelector('#repas-texte').value.trim()
      const ingredients = container.querySelector('#repas-ingredients').value
      enregistrerDoc(doc(refRepas, dateStr), { date: dateStr, [moment]: { texte, ingredients } }, { merge: true })
      envoyerAEpicerie(ingredients.split('\n'))
      repasOuvert = null
      renderRepas()
    }
  })
  container.querySelectorAll('[data-save-recette]').forEach(el => {
    el.onclick = () => {
      const texte = container.querySelector('#repas-texte').value.trim()
      const ingredients = container.querySelector('#repas-ingredients').value
      if (!texte) return
      ajouterDoc(refRecettes, { texte, ingredients })
    }
  })
  container.querySelectorAll('[data-clear-repas]').forEach(el => {
    el.onclick = () => {
      const [dateStr, moment] = el.dataset.clearRepas.split('|')
      enregistrerDoc(doc(refRepas, dateStr), { [moment]: null }, { merge: true })
      repasOuvert = null
      renderRepas()
    }
  })
  container.querySelectorAll('[data-recette]').forEach(el => {
    el.onclick = (e) => {
      if (e.target.dataset.supprRecette) {
        if (confirm('Supprimer cette recette ?')) supprimerDoc(doc(refRecettes, e.target.dataset.supprRecette))
        return
      }
      const r = recettes.find(x => x.id === el.dataset.recette)
      const cible = repasOuvert || (formatDateISO(new Date()) + '|souper')
      const [dateStr, moment] = cible.split('|')
      enregistrerDoc(doc(refRepas, dateStr), { date: dateStr, [moment]: { texte: r.texte, ingredients: r.ingredients || '' } }, { merge: true })
      envoyerAEpicerie((r.ingredients || '').split('\n'))
      repasOuvert = null
    }
  })
}

// — épicerie —

function renderEpicerie() {
  const container = document.getElementById('section-epicerie')
  const actifs = epicerieItems.filter(i => !i.fait)
  const faits = epicerieItems.filter(i => i.fait)

  let html = enTete('Épicerie', `${actifs.length} à acheter`, boutonsEnTete())

  html += '<div class="body"><div class="card">'
  if (epicerieItems.length === 0) {
    html += '<p class="empty">Liste vide</p>'
  }
  actifs.concat(faits).forEach(item => {
    html += `<div class="row${item.fait ? ' done' : ''}">
      <button type="button" class="check round${item.fait ? ' on' : ''}" data-ep="${item.id}" aria-label="${escapeHtml(item.texte)} : ${item.fait ? 'décocher' : 'cocher'}"><i class="ph-fill ph-check"></i></button>
      <div class="main"><div class="titre">${escapeHtml(item.texte)}</div></div>
      <button type="button" class="ghost-btn" data-ep-suppr="${item.id}" aria-label="Supprimer ${escapeHtml(item.texte)}"><i class="ph ph-x"></i></button>
    </div>`
  })
  html += `</div>
    <div class="form-row">
      <input class="input full" id="epicerie-texte" placeholder="Ajouter un item">
      <button type="button" class="btn" id="epicerie-ajouter"><i class="ph ph-plus"></i></button>
    </div>
  </div>`

  container.innerHTML = html
  brancherEnTete(container)
  container.querySelectorAll('[data-ep]').forEach(el => {
    el.onclick = () => {
      const item = epicerieItems.find(i => i.id === el.dataset.ep)
      modifierDoc(doc(refEpicerie, item.id), { fait: !item.fait })
    }
  })
  container.querySelectorAll('[data-ep-suppr]').forEach(el => {
    el.onclick = () => {
      if (confirm('Supprimer cet item de la liste ?')) supprimerDoc(doc(refEpicerie, el.dataset.epSuppr))
    }
  })
  const ajouter = () => {
    const texte = container.querySelector('#epicerie-texte').value.trim()
    if (!texte) return
    ajouterDoc(refEpicerie, { texte, fait: false })
    container.querySelector('#epicerie-texte').value = ''
  }
  container.querySelector('#epicerie-ajouter').onclick = ajouter
  container.querySelector('#epicerie-texte').onkeydown = (e) => { if (e.key === 'Enter') ajouter() }
}

// — dépenses —

function categorieDe(item) {
  return categoriesDepenses.some(c => c.cat === item.categorie) ? item.categorie : 'Autre'
}

function itemsPourMois(mois) {
  const instances = []
  depensesItems.filter(i => i.recurrente).forEach(r => {
    const paiements = r.moisPayes || {}
    const moisPayes = mois === 'tous' ? Object.keys(paiements).filter(m => paiements[m]) : (paiements[mois] ? [mois] : [])
    moisPayes.forEach(m => {
      instances.push({ id: r.id + '-' + m, desc: r.desc, montant: r.montant, payeur: r.payeur, categorie: r.categorie, instance: true })
    })
  })
  return instances
}

function moisDisponibles() {
  const set = new Set([moisActuelCle()])
  depensesItems.forEach(i => {
    if (i.recurrente && i.moisPayes) Object.keys(i.moisPayes).filter(m => i.moisPayes[m]).forEach(m => set.add(m))
  })
  return Array.from(set).sort().reverse()
}

// un montant "Les deux" est déjà partagé en vrai, donc il compte pour moitié chacun
// (ça évite qu'il crée une fausse dette dans le calcul qui doit à qui)
function calculerReglement(items) {
  const total = items.reduce((a, i) => a + i.montant, 0)
  const parPersonne = {}
  const ajouter = (nom, montant) => { parPersonne[nom] = (parPersonne[nom] || 0) + montant }
  items.forEach(i => {
    if (i.payeur === 'Les deux') {
      ajouter('Léonie', i.montant / 2)
      ajouter('Gabriel', i.montant / 2)
    } else {
      ajouter(i.payeur, i.montant)
    }
  })
  const noms = Object.keys(parPersonne)
  if (noms.length === 0) return { total, transactions: [], parPersonne }
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
  return { total, transactions, parPersonne }
}

function exporterDepensesCSV() {
  const items = itemsPourMois(moisSelectionne)
  if (items.length === 0) {
    alert('Rien à exporter pour cette période.')
    return
  }
  const lignes = [['Description', 'Montant', 'Payé par', 'Catégorie', 'Mois'].join(',')]
  items.forEach(i => {
    const mois = moisSelectionne === 'tous' ? '' : moisSelectionne
    const champs = [i.desc, i.montant, i.payeur, categorieDe(i), mois].map(v => `"${String(v).replace(/"/g, '""')}"`)
    lignes.push(champs.join(','))
  })
  const csv = '﻿' + lignes.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `depenses-${moisSelectionne === 'tous' ? 'toutes' : moisSelectionne}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function renderDepenses() {
  const container = document.getElementById('section-depenses')
  const items = itemsPourMois(moisSelectionne)
  const { total, transactions, parPersonne } = calculerReglement(items)
  const t0 = transactions[0]
  const noms = Object.keys(parPersonne)
  const recurrentes = depensesItems.filter(i => i.recurrente)

  let html = enTete('Dépenses', formatMois(moisSelectionne === 'tous' ? moisActuelCle() : moisSelectionne), `
    <button type="button" class="icon-btn" id="exporter-depenses" aria-label="Exporter en CSV"><i class="ph ph-download-simple"></i></button>
    ${boutonsEnTete()}`)

  html += `<div class="body">
    <select class="input" id="depenses-mois">
      <option value="tous"${moisSelectionne === 'tous' ? ' selected' : ''}>Tous les mois</option>
      ${moisDisponibles().map(m => `<option value="${m}"${m === moisSelectionne ? ' selected' : ''}>${formatMois(m)}</option>`).join('')}
    </select>

    <div class="hero">`

  if (noms.length === 0) {
    html += `<div class="legend">Aucune dépense pour cette période</div>`
  } else {
    html += `<div class="repartition">
      ${noms.map(n => `<div class="repartition-ligne"><span>${escapeHtml(n)} a payé</span><strong>${argent(parPersonne[n])}</strong></div>`).join('')}
    </div>
    <div class="progress-legend" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--line-soft)">
      <span>${t0 ? `${escapeHtml(t0.de)} doit ${argent(t0.montant)} à ${escapeHtml(t0.a)}` : 'Vous êtes à égalité, rien à régler'}</span>
    </div>`
  }
  html += `<div class="progress-legend" style="margin-top:10px"><span>${argent(total)} au total ce mois-ci</span></div>
    </div>

    <p class="meta" style="margin:0 2px 12px">Les dépenses partagées qui reviennent chaque mois (loyer, internet...). Coche « payé » une fois par mois, pas besoin de la retaper.</p>
    <div class="section-title"><span>Dépenses partagées</span></div>
    <div class="card">`

  if (recurrentes.length === 0) html += '<p class="empty">Aucune dépense partagée</p>'
  recurrentes.forEach(r => {
    const paye = !!(r.moisPayes && r.moisPayes[moisSelectionne])
    const jourTexte = r.jourPaiement ? ` · le ${r.jourPaiement}` : ''
    const payeurTexte = r.payeur === 'Les deux' ? 'payé ensemble' : escapeHtml(r.payeur)
    html += `<div class="row">
      <button type="button" class="check${paye ? ' on' : ''}" data-rec="${r.id}" ${moisSelectionne === 'tous' ? 'disabled style="opacity:.45"' : ''} aria-label="${escapeHtml(r.desc)} : ${paye ? 'marquer non payé' : 'marquer payé'}"><i class="ph-fill ph-check"></i></button>
      <div class="main"><div class="titre">${escapeHtml(r.desc)}</div><div class="meta">${argent(r.montant)} · ${payeurTexte}${jourTexte}<span class="tag">${escapeHtml(categorieDe(r))}</span></div></div>
      <button type="button" class="ghost-btn" data-detail-rec="${r.id}" aria-label="${recOuvert === r.id ? 'Fermer les détails' : 'Modifier'}"><i class="ph ph-${recOuvert === r.id ? 'caret-up' : 'caret-down'}"></i></button>
      <button type="button" class="ghost-btn" data-rec-suppr="${r.id}" aria-label="Supprimer ${escapeHtml(r.desc)}"><i class="ph ph-x"></i></button>
    </div>`
    if (recOuvert === r.id) {
      html += `<div class="edit-panel">
        <input class="input" id="rec-edit-jour-${r.id}" type="number" min="1" max="31" placeholder="Jour du mois (ex: 1 pour le loyer)" value="${r.jourPaiement || ''}">
        <select class="input" id="rec-edit-payeur-${r.id}">
          <option value="Léonie"${r.payeur === 'Léonie' ? ' selected' : ''}>Léonie</option>
          <option value="Gabriel"${r.payeur === 'Gabriel' ? ' selected' : ''}>Gabriel</option>
          <option value="Les deux"${r.payeur === 'Les deux' ? ' selected' : ''}>Les deux</option>
        </select>
        <div class="edit-actions"><button type="button" class="btn btn-sm" data-save-rec="${r.id}">Enregistrer</button></div>
      </div>`
    }
  })
  html += '</div>'
  if (recAjoutOuvert) {
    html += `<p class="meta" style="margin:12px 2px 8px">Une nouvelle dépense partagée :</p>
    <div class="form-grid">
      <input class="input full" id="recurrente-desc" placeholder="Description (ex: Loyer)">
      <input class="input" id="recurrente-montant" placeholder="Montant" type="number" step="0.01">
      <select class="input" id="recurrente-payeur">
        <option value="Léonie"${currentName() === 'Léonie' ? ' selected' : ''}>Léonie</option>
        <option value="Gabriel"${currentName() === 'Gabriel' ? ' selected' : ''}>Gabriel</option>
        <option value="Les deux">Les deux</option>
      </select>
      <select class="input" id="recurrente-categorie">${categoriesDepenses.map(c => `<option value="${c.cat}">${c.cat}</option>`).join('')}</select>
      <input class="input" id="recurrente-jour" type="number" min="1" max="31" placeholder="Jour du mois (optionnel)">
      <button type="button" class="btn btn-quiet" id="recurrente-ajouter"><i class="ph ph-plus"></i>Ajouter</button>
    </div>`
  } else {
    html += `<button type="button" class="btn btn-quiet btn-block" id="rec-ajout-ouvrir" style="margin-top:12px"><i class="ph ph-plus"></i>Ajouter une dépense partagée</button>`
  }

  html += '</div>'

  container.innerHTML = html
  brancherEnTete(container)
  container.querySelector('#exporter-depenses').onclick = exporterDepensesCSV
  container.querySelector('#depenses-mois').onchange = (e) => {
    moisSelectionne = e.target.value
    renderDepenses()
  }

  container.querySelectorAll('[data-rec]').forEach(el => {
    el.onclick = () => {
      const r = recurrentes.find(x => x.id === el.dataset.rec)
      const moisPayes = Object.assign({}, r.moisPayes || {})
      moisPayes[moisSelectionne] = !moisPayes[moisSelectionne]
      modifierDoc(doc(refDepenses, r.id), { moisPayes })
    }
  })
  container.querySelectorAll('[data-rec-suppr]').forEach(el => {
    el.onclick = () => {
      if (confirm('Supprimer cette dépense récurrente ?')) supprimerDoc(doc(refDepenses, el.dataset.recSuppr))
    }
  })
  container.querySelectorAll('[data-detail-rec]').forEach(el => {
    el.onclick = () => {
      recOuvert = recOuvert === el.dataset.detailRec ? null : el.dataset.detailRec
      renderDepenses()
    }
  })
  container.querySelectorAll('[data-save-rec]').forEach(el => {
    el.onclick = () => {
      const id = el.dataset.saveRec
      const jourPaiement = container.querySelector(`#rec-edit-jour-${id}`).value.trim()
      const payeur = container.querySelector(`#rec-edit-payeur-${id}`).value
      modifierDoc(doc(refDepenses, id), { jourPaiement, payeur })
      recOuvert = null
      renderDepenses()
    }
  })
  const recAjoutOuvrir = container.querySelector('#rec-ajout-ouvrir')
  if (recAjoutOuvrir) recAjoutOuvrir.onclick = () => { recAjoutOuvert = true; renderDepenses() }
  const recAjouter = container.querySelector('#recurrente-ajouter')
  if (recAjouter) {
    recAjouter.onclick = () => {
      const desc = container.querySelector('#recurrente-desc').value.trim()
      const montant = parseFloat(container.querySelector('#recurrente-montant').value)
      const payeur = container.querySelector('#recurrente-payeur').value.trim()
      if (!desc || !montant || !payeur) return
      ajouterDoc(refDepenses, {
        desc, montant, payeur,
        categorie: container.querySelector('#recurrente-categorie').value,
        jourPaiement: container.querySelector('#recurrente-jour').value.trim(),
        recurrente: true,
        moisPayes: {}
      })
      recAjoutOuvert = false
      renderDepenses()
    }
  }
}

// — rappels —
// Notifications "best effort" : ça marche seulement quand l'app est ouverte (ou récemment ouverte
// en arrière-plan sur ordi/Android). Il n'y a pas de vraie notification push en arrière-plan sans
// serveur (Firebase Cloud Messaging + Cloud Functions), et iOS Safari est très limité de toute façon.

function supportNotif() {
  return 'Notification' in window
}

function demanderPermissionNotif() {
  if (supportNotif() && Notification.permission === 'default') Notification.requestPermission().then(() => rendreRappelsOuvert())
}

function correspondAujourdhui(quand) {
  return correspondALaDate(quand, new Date())
}

function verifierRappelsDuJour() {
  if (!supportNotif() || Notification.permission !== 'granted') return
  const aujourdhui = formatDateISO(new Date())
  const deja = JSON.parse(localStorage.getItem('app-appart-notifs-vues') || '{}')
  rappels.filter(r => r.actif && correspondAujourdhui(r.quand)).forEach(r => {
    const cle = r.id + '|' + aujourdhui
    if (deja[cle]) return
    new Notification(r.nom, { body: r.quand, icon: 'icon-192.png' })
    deja[cle] = true
  })
  localStorage.setItem('app-appart-notifs-vues', JSON.stringify(deja))
}

function rendreRappelsOuvert() {
  const el = document.getElementById('rappels-overlay')
  if (el.style.display === 'flex') ouvrirRappels()
}

function ouvrirRappels() {
  const el = document.getElementById('rappels-overlay')
  el.style.display = 'flex'
  const actifs = rappels.filter(r => r.actif).length

  el.innerHTML = `<div class="sheet-bas">
    <div class="sheet-head">
      <div><div class="titre">Rappels</div><div class="meta">${actifs} actifs</div></div>
      <button type="button" class="icon-btn" id="fermer-rappels" aria-label="Fermer"><i class="ph ph-x"></i></button>
    </div>
    <div class="card">
      ${rappels.length === 0 ? '<p class="empty">Aucun rappel</p>' : rappels.map(r => `
        <div class="row">
          <div class="pill-icon" style="background:transparent;color:var(--accent-light)"><i class="ph ${r.icon || 'ph-bell'}"></i></div>
          <div class="main"><div class="titre" style="font-size:14.5px">${escapeHtml(r.nom)}</div><div class="meta">${escapeHtml(r.quand)}</div></div>
          <button type="button" class="switch${r.actif ? ' on' : ''}" data-rap="${r.id}" aria-label="${r.actif ? 'Désactiver' : 'Activer'} le rappel ${escapeHtml(r.nom)}"><span></span></button>
          <button type="button" class="ghost-btn" data-rap-suppr="${r.id}" aria-label="Supprimer le rappel ${escapeHtml(r.nom)}"><i class="ph ph-x"></i></button>
        </div>`).join('')}
    </div>
    <div class="form-grid" style="margin-top:12px">
      <input class="input full" id="rappel-nom" placeholder="Nouveau rappel (ex: Poubelles)">
      <input class="input" id="rappel-quand" placeholder="Quand (ex: mardi, 19 h)">
      <button type="button" class="btn" id="rappel-ajouter"><i class="ph ph-plus"></i>Ajouter</button>
    </div>
    ${supportNotif() && Notification.permission !== 'granted' ? `
    <button type="button" class="btn btn-quiet btn-block" id="activer-notifs" style="margin-top:12px"><i class="ph ph-bell-ringing"></i>Activer les notifications</button>` : ''}
    <p class="meta" style="margin-top:12px;color:var(--ink-faint)">${supportNotif() && Notification.permission === 'granted'
      ? "Les rappels actifs t'avertissent quand tu ouvres l'app le bon jour."
      : "Les rappels s'affichent dans l'app. Pour recevoir de vraies notifications sur ton iPhone, ajoute l'app à l'écran d'accueil."}</p>
  </div>`

  el.onclick = (e) => { if (e.target.id === 'rappels-overlay') el.style.display = 'none' }
  el.querySelector('#fermer-rappels').onclick = () => { el.style.display = 'none' }
  const boutonNotifs = el.querySelector('#activer-notifs')
  if (boutonNotifs) boutonNotifs.onclick = demanderPermissionNotif
  el.querySelectorAll('[data-rap]').forEach(b => {
    b.onclick = () => {
      const r = rappels.find(x => x.id === b.dataset.rap)
      modifierDoc(doc(refRappels, r.id), { actif: !r.actif })
    }
  })
  el.querySelectorAll('[data-rap-suppr]').forEach(b => {
    b.onclick = () => {
      if (confirm('Supprimer ce rappel ?')) supprimerDoc(doc(refRappels, b.dataset.rapSuppr))
    }
  })
  el.querySelector('#rappel-ajouter').onclick = () => {
    const nom = el.querySelector('#rappel-nom').value.trim()
    const quand = el.querySelector('#rappel-quand').value.trim()
    if (!nom) return
    ajouterDoc(refRappels, { nom, quand: quand || 'sans horaire', icon: 'ph-bell', actif: true })
    el.querySelector('#rappel-nom').value = ''
    el.querySelector('#rappel-quand').value = ''
  }
}

// — rendu global —

let renduEnAttente = false

function champActif() {
  const el = document.activeElement
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')
}

function rendre() {
  if (!pret) return
  if (champActif()) {
    renduEnAttente = true
    return
  }
  renduEnAttente = false
  renderAccueil()
  renderChecklist()
  renderRepas()
  renderEpicerie()
  renderDepenses()
  majBadge()
  if (document.getElementById('rappels-overlay').style.display === 'flex') ouvrirRappels()
  if (calJourOuvert && document.getElementById('jour-overlay').style.display === 'flex') ouvrirJour(calJourOuvert)
  goTo(ongletActuel)
}

// tant qu'on tape dans un champ, on ne redessine pas l'écran (ça effacerait le texte en cours)
// dès qu'on quitte le champ, on rattrape le rendu si des changements sont arrivés entretemps
document.addEventListener('focusout', () => {
  if (renduEnAttente) rendre()
})

// — démarrage —

signInAnonymously(auth).then(() => {
  document.getElementById('loading').style.display = 'none'
  document.getElementById('tabbar').style.display = ''
  pret = true
  setupNav()

  getDocs(refChecklist).then(snap => {
    if (snap.empty) items_depart.forEach(([cat, txt]) => ajouterDoc(refChecklist, { texte: txt, categorie: cat, fait: false }))
  })
  getDocs(refRappels).then(snap => {
    if (snap.empty) rappels_depart.forEach(r => ajouterDoc(refRappels, r))
  })

  const suivre = (ref, setter) => onSnapshot(ref, snap => {
    setter(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    rendre()
  })

  suivre(refChecklist, v => { checklistItems = v })
  suivre(refTaches, v => { tachesItems = v })
  suivre(refEpicerie, v => { epicerieItems = v })
  suivre(refDepenses, v => { depensesItems = v })
  suivre(refRepas, v => { repasItems = v })
  suivre(refRecettes, v => { recettes = v })
  suivre(refRappels, v => { rappels = v; verifierRappelsDuJour() })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') verifierRappelsDuJour()
  })
  onSnapshot(refConfig, snap => {
    dateCible = snap.exists() ? (snap.data().dateCible || '') : ''
    rendre()
  })

  if (!currentName()) ouvrirProfil()
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
}
