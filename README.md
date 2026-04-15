# JOJMA

JOJMA est une plateforme spécialisée dans la gestion de modèles 3D et la Réalité Augmentée (AR). Son objectif principal est de rendre ces technologies accessibles, simples à utiliser et prêtes à être intégrées dans des usages professionnels, commerciaux et créatifs.

La plateforme agit comme un pont entre les fichiers 3D ou les produits physiques et une expérience immersive en réalité augmentée, directement accessible depuis un smartphone, sans installation d’application tierce.

---

## Aperçu du projet

JOJMA permet aux entreprises, créateurs et professionnels de gérer, convertir, visualiser et partager leurs modèles 3D dans un environnement web moderne.

La plateforme propose plusieurs services clés :

- conversion automatique de fichiers 3D en formats optimisés ;
- visualisation 3D sur le web ;
- affichage en réalité augmentée sur mobile ;
- génération de liens uniques et de QR Codes ;
- gestion des fichiers depuis un tableau de bord ;
- mise en relation avec des experts pour la création de modèles 3D.

---

## Fonctionnalités principales

- Inscription et connexion sécurisées
- Tableau de bord administrateur
- Tableau de bord utilisateur
- Upload de fichiers 3D
- Conversion entre formats
- Visualisation 3D sur le web
- Affichage AR sur mobile
- Génération de QR Code
- Gestion des rôles
- Formulaire de contact
- Chatbot intégré

---

## Services proposés par JOJMA

### Conversion multi-format
JOJMA accepte plus de 10 formats 3D, notamment STL, FBX, OBJ et PLY, puis les convertit automatiquement vers des formats optimisés pour le web et la réalité augmentée, tels que GLB pour Android/Web et USDZ pour iOS.

### Visualisation en Réalité Augmentée
La plateforme permet de visualiser instantanément les modèles 3D dans un environnement réel à l’aide d’un smartphone, sans qu’il soit nécessaire d’installer une application externe.

### Partage et intégration
Pour chaque modèle importé, JOJMA génère un lien unique ainsi qu’un QR Code. Ces éléments peuvent être partagés avec des clients ou intégrés sur un site e-commerce afin d’offrir une expérience interactive.

### Création de modèles 3D
JOJMA propose également de connecter les utilisateurs avec des experts capables de transformer des produits physiques en modèles 3D de haute qualité.

### Tableau de bord de gestion
Chaque utilisateur dispose d’un espace personnel pour gérer ses fichiers, suivre les conversions et organiser son catalogue de produits 3D.

---

## Stack technique

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- JWT
- Multer

### Base de données
- MySQL

### Outils complémentaires
- Blender
- Bibliothèque de génération de QR Code
- Git / GitHub

---

## Structure du projet

```bash
JOJMA_ENT/
├── .scannerwork/
├── backend/
├── dist/
├── docs/
├── frontend/
├── node_modules/
├── outputs/
├── python/
├── scripts/
├── .env
├── .gitignore
├── index.html
├── metadata.json
├── package-lock.json
├── package.json
├── README.md
├── sonar-project.properties
├── tsconfig.json
├── validate.js
└── vite.config.ts