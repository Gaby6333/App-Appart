# App Appart

Petite app pour Léonie et Gabriel : checklist de déménagement, tâches ménagères, repas de la semaine, liste d'épicerie et dépenses partagées. HTML/CSS/JS pur, Firebase (Firestore + Storage) pour les données, déployée sur GitHub Pages.

## Développement

Pas de build, pas d'installation. Ouvre `index.html` avec un petit serveur local (par exemple l'extension "Live Server" de VS Code, ou `python3 -m http.server`).

## Déploiement

Rien à faire : GitHub Pages sert les fichiers directement depuis la branche `main`. Un `git push` suffit, le site se met à jour tout seul.

## Fonctionnalités

- **Profil** : au premier lancement, tu choisis Léonie ou Gabriel (bouton en haut à droite pour changer). Ça pré-remplit le "payé par" des dépenses.
- **Thème clair/sombre** : bouton lune/soleil en haut à droite, suit le thème du système par défaut.
- **Checklist** : compte à rebours jusqu'à la date de déménagement, qui a acheté chaque item, et pour chaque item — lien vers le produit, une note, et une photo.
- **Tâches** : liste de rappels de base (sortir les poubelles, etc.) avec récurrence (une fois / chaque semaine / chaque mois) et le nom de qui l'a fait la dernière fois.
- **Repas** : calendrier de la semaine avec déjeuner, dîner et souper pour chaque jour — les ingrédients notés s'ajoutent automatiquement à l'épicerie (sans doublon si déjà présents).
- **Épicerie** : items groupés par rayon, avec quantité et prix, une recherche, un total estimé du panier, et des favoris (étoile sur un item pour le sauvegarder, chip cliquable pour le rajouter vite la prochaine fois).
- **Dépenses** : groupées par catégorie, filtre par mois, règlement automatique pour n'importe quel nombre de personnes, et une section "Dépenses récurrentes" (loyer, internet...) où tu coches juste "payé" chaque mois sans retaper.

## Photos dans la checklist — à vérifier

Les photos uploadées dans la checklist utilisent Firebase Storage (pas juste Firestore). C'est nouveau pour ce projet — si l'upload échoue une fois que c'est en ligne, va voir l'onglet **Storage** dans la console Firebase (console.firebase.google.com, projet `app-appart`). S'il te demande de passer au forfait Blaze (payant à l'usage) pour l'activer, c'est normal : Google a changé cette règle pour les nouveaux espaces de stockage. Le forfait Blaze a quand même un palier gratuit généreux (5 Go de stockage, largement assez pour des photos de meubles), donc ça ne devrait rien coûter pour un usage comme le vôtre — mais il faut quand même mettre une carte de crédit en dossier. Si vous préférez éviter ça, dites-le moi et je repasse les photos en simple lien plutôt qu'en upload direct.

Une fois Storage activé, va dans l'onglet **Rules** de Storage et colle le contenu de `storage.rules` (comme vous avez dû le faire pour `firestore.rules`).

## Base de données

Toutes les données sont dans Firestore, partagées entre tous ceux qui se connectent au site (connexion anonyme automatique). Les règles Firestore (`firestore.rules`) autorisent la lecture/écriture à n'importe qui d'authentifié, donc quiconque a le lien du site voit et modifie les mêmes données.

## Fichiers qui ne servent plus

Le projet utilisait React + Vite avant. Ces fichiers/dossiers ne sont plus utilisés et peuvent être supprimés : `src/`, `public/`, `node_modules/`, `dist/`, `package.json`, `package-lock.json`, `vite.config.js`.
