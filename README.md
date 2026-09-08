# App Appart

App pour gérer le déménagement et le quotidien de l'appart: checklist, tâches, épicerie, dépenses.

## 1. Créer le projet Firebase

1. Va sur https://console.firebase.google.com
2. "Ajouter un projet", donne-lui un nom (ex: app-appart)
3. Dans le menu de gauche: Compilation > Firestore Database > Créer une base de données (mode production)
4. Dans le menu de gauche: Compilation > Authentication > Sign-in method > active "Anonyme"
5. Va dans les paramètres du projet (roue dentée) > "Vos applications" > icône Web (</>)
6. Donne un nom à l'app et copie l'objet `firebaseConfig` qui apparaît

## 2. Connecter la config

Ouvre `src/firebase.js` et remplace les valeurs `REMPLACE_MOI` par celles copiées à l'étape précédente.

## 3. Installer et lancer en local

Dans le dossier du projet:

```
npm install
npm run dev
```

Ça ouvre l'app sur ton navigateur, généralement http://localhost:5173

## 4. Publier les règles Firestore

Installe l'outil Firebase si pas déjà fait:

```
npm install -g firebase-tools
firebase login
firebase init firestore
```

Choisis ton projet existant, garde `firestore.rules` comme fichier de règles (remplace le contenu généré par celui déjà dans ce dossier), puis:

```
firebase deploy --only firestore:rules
```

## 5. Déployer l'app en ligne (Firebase Hosting)

```
firebase init hosting
```

Réponds:
- Dossier public: `dist`
- App une page (SPA): oui
- Ne pas écraser index.html

Ensuite, à chaque fois que tu veux mettre l'app en ligne:

```
npm run build
firebase deploy --only hosting
```

Firebase te donne un lien du genre `app-appart.web.app` que tu peux ajouter à l'écran d'accueil de vos téléphones.

## 6. Mettre sur GitHub

```
git add .
git commit -m "premiere version app appart"
git branch -M main
git remote add origin TON_LIEN_GITHUB
git push -u origin main
```

## Structure des données Firestore

- `checklist`: items de déménagement (texte, catégorie, fait) — préremplie au premier chargement
- `taches`: tâches ménagères récurrentes (texte, fait)
- `epicerie`: liste d'épicerie (texte, fait)
- `depenses`: dépenses communes (desc, montant, payeur)

## Prochaines étapes possibles

- Bouton pour réinitialiser la checklist de déménagement une fois le move fait
- Rotation automatique des tâches entre vous deux
- Historique des dépenses par mois
