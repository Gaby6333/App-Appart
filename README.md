# App Appart

Petite app pour Léonie et Gabriel : checklist de déménagement, tâches ménagères, repas de la semaine, liste d'épicerie et dépenses partagées. HTML/CSS/JS pur, Firebase (Firestore) pour les données, déployée sur GitHub Pages.

## Développement

Pas de build, pas d'installation. Ouvre `index.html` avec un petit serveur local (par exemple l'extension "Live Server" de VS Code, ou `python3 -m http.server`).

## Déploiement

Rien à faire : GitHub Pages sert les fichiers directement depuis la branche `main`. Un `git push` suffit, le site se met à jour tout seul.

## Fonctionnalités

- **Profil** : au premier lancement, tu choisis Léonie ou Gabriel (bouton en haut à droite pour changer). Ça pré-remplit le "payé par" des dépenses.
- **Checklist** : compte à rebours jusqu'à la date de déménagement, qui a acheté chaque item, et pour chaque item — lien vers le produit et une note.
- **Tâches** : liste de rappels de base (sortir les poubelles, etc.) avec récurrence (une fois / chaque semaine / chaque mois), un jour assigné (jour de la semaine, du mois, ou date précise) et le nom de qui l'a fait la dernière fois. Se gèrent depuis la carte "À faire aujourd'hui" sur l'accueil.
- **Calendrier** : sur l'accueil, une grille du mois avec un point par jour pour les repas planifiés, les tâches, les paiements récurrents et les rappels. Cliquer sur une journée ouvre un récap de tout ce qui s'y trouve.
- **Repas** : calendrier de la semaine avec déjeuner, dîner et souper pour chaque jour — les ingrédients notés s'ajoutent automatiquement à l'épicerie (sans doublon si déjà présents).
- **Épicerie** : items groupés par rayon, avec quantité et prix, une recherche, un total estimé du panier, et des favoris (étoile sur un item pour le sauvegarder, chip cliquable pour le rajouter vite la prochaine fois).
- **Dépenses** : 3 sous-onglets. "Résumé" — qui a payé combien ce mois-ci, le règlement automatique qui en découle (qui doit combien à qui), le graphique des 6 derniers mois et la répartition par catégorie. "Historique" — la liste des dépenses ponctuelles du mois avec le formulaire pour en ajouter une. "Récurrentes" — les dépenses qui reviennent chaque mois (loyer, internet...) où tu coches juste "payé" sans retaper, avec un jour du mois optionnel (pour qu'elle apparaisse au calendrier). Un export CSV du mois affiché est disponible dans l'en-tête.
- **Rappels** : liste de rappels personnalisables (loyer, planifier les repas...) accessible via la cloche en haut à droite. Si tu actives les notifications, l'app t'avertit quand tu l'ouvres un jour où un rappel actif tombe — ça ne fonctionne que pendant que l'app est ouverte, pas en vraie notification push en arrière-plan (ça demanderait un serveur).

## Base de données

Toutes les données sont dans Firestore, partagées entre tous ceux qui se connectent au site (connexion anonyme automatique). Les règles Firestore (`firestore.rules`) autorisent la lecture/écriture à n'importe qui d'authentifié, donc quiconque a le lien du site voit et modifie les mêmes données.

## Fichiers qui ne servent plus

Le projet utilisait React + Vite avant. Ces fichiers/dossiers ne sont plus utilisés et peuvent être supprimés : `src/`, `public/`, `node_modules/`, `dist/`, `package.json`, `package-lock.json`, `vite.config.js`.
