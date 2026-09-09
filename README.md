# App Appart

Petite app pour gérer l'appart : checklist de déménagement, tâches ménagères, liste d'épicerie et dépenses partagées. HTML/CSS/JS pur, Firebase (Firestore) pour les données, déployée sur GitHub Pages.

## Développement

Pas de build, pas d'installation. Ouvre `index.html` avec un petit serveur local (par exemple l'extension "Live Server" de VS Code, ou `python3 -m http.server`).

## Déploiement

Rien à faire : GitHub Pages sert les fichiers directement depuis la branche `main`. Un `git push` suffit, le site se met à jour tout seul.

## Fonctionnalités

- **Profil** : au premier lancement, chacun choisit son nom (bouton en haut à droite pour le changer). Il pré-remplit le "payé par" des dépenses et l'"assigné à" des tâches.
- **Thème clair/sombre** : bouton lune/soleil en haut à droite, suit le thème du système par défaut.
- **Checklist** : compte à rebours jusqu'à la date de déménagement, et le nom de qui a acheté chaque item.
- **Tâches** : récurrence (une fois / chaque semaine / chaque mois) et rotation automatique entre deux personnes ou plus quand une tâche récurrente est cochée.
- **Repas** : calendrier de la semaine, clique sur un jour pour noter le repas et ses ingrédients — ils s'ajoutent automatiquement à l'épicerie (sans doublon si déjà présents).
- **Épicerie** : items groupés par rayon, avec quantité.
- **Dépenses** : catégories, filtre par mois, et règlement automatique pour n'importe quel nombre de personnes (pas juste deux).

## Base de données

Toutes les données sont dans Firestore, partagées entre tous ceux qui se connectent au site (connexion anonyme automatique). Les règles Firestore (`firestore.rules`) autorisent la lecture/écriture à n'importe qui d'authentifié, donc quiconque a le lien du site voit et modifie les mêmes données.

## Fichiers qui ne servent plus

Le projet utilisait React + Vite avant. Ces fichiers/dossiers ne sont plus utilisés et peuvent être supprimés : `src/`, `public/`, `node_modules/`, `dist/`, `package.json`, `package-lock.json`, `vite.config.js`.
