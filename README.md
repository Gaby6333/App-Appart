# App Appart

Petite app pour gérer l'appart : checklist de déménagement, tâches ménagères, liste d'épicerie et dépenses partagées. HTML/CSS/JS pur, Firebase (Firestore) pour les données, déployée sur GitHub Pages.

## Développement

Pas de build, pas d'installation. Ouvre `index.html` avec un petit serveur local (par exemple l'extension "Live Server" de VS Code, ou `python3 -m http.server`).

## Déploiement

Rien à faire : GitHub Pages sert les fichiers directement depuis la branche `main`. Un `git push` suffit, le site se met à jour tout seul.

## Base de données

Toutes les données (checklist, tâches, épicerie, dépenses) sont stockées dans Firestore, dans des collections partagées entre tous ceux qui se connectent au site (connexion anonyme automatique). Les règles Firestore (`firestore.rules`) autorisent la lecture/écriture à n'importe qui d'authentifié, donc quiconque a le lien du site voit et modifie les mêmes données.

## Fichiers qui ne servent plus

Le projet utilisait React + Vite avant. Ces fichiers/dossiers ne sont plus utilisés et peuvent être supprimés : `src/`, `public/`, `node_modules/`, `dist/`, `package.json`, `package-lock.json`, `vite.config.js`.
