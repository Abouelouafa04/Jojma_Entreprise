
---

# `docs/documentation-jojma.md`

```md
# Documentation du projet JOJMA

## 1. Introduction

Dans le cadre de la réalisation du projet JOJMA, nous avons développé une plateforme web full stack spécialisée dans la gestion des modèles 3D et la Réalité Augmentée (AR). Ce projet a été pensé pour rendre ces technologies plus accessibles, plus simples à utiliser et mieux adaptées aux besoins des entreprises, des créateurs et des professionnels.

L’idée principale de JOJMA est de proposer une solution centralisée permettant de charger des fichiers 3D, de les convertir automatiquement, de les visualiser sur le web, de les afficher en réalité augmentée et de les partager facilement à travers un lien ou un QR Code.

---

## 2. Présentation du projet

JOJMA est une plateforme innovante qui sert de pont entre les produits physiques ou les fichiers 3D bruts et une expérience immersive en réalité augmentée.

Elle permet aux utilisateurs de :

- téléverser leurs fichiers 3D ;
- convertir ces fichiers dans des formats compatibles avec le web et l’AR ;
- visualiser les modèles directement dans le navigateur ;
- lancer l’affichage en réalité augmentée sur mobile ;
- partager les modèles à l’aide de liens uniques et de QR Codes ;
- gérer l’ensemble de leurs ressources à partir d’un tableau de bord.

La plateforme s’adresse principalement aux entreprises, aux créateurs, aux designers, aux vendeurs e-commerce et à toute personne souhaitant exploiter le potentiel des technologies 3D et AR de manière simple et professionnelle.

---

## 3. Problématique

L’utilisation des fichiers 3D et de la réalité augmentée reste souvent complexe pour de nombreux utilisateurs. Les solutions existantes demandent parfois des compétences techniques avancées, des logiciels spécifiques ou des applications externes.

De plus, les problèmes de compatibilité entre les formats, les appareils et les systèmes d’exploitation rendent l’exploitation des modèles 3D plus difficile, surtout dans un cadre professionnel ou commercial.

JOJMA a donc été conçu pour répondre à cette problématique en proposant une plateforme unique, intuitive et moderne qui simplifie la gestion, la conversion, la visualisation et le partage des modèles 3D.

---

## 4. Objectifs du projet

Les principaux objectifs de JOJMA sont les suivants :

- développer une plateforme web full stack moderne et performante ;
- rendre la gestion des modèles 3D plus simple et plus accessible ;
- automatiser la conversion entre différents formats 3D ;
- permettre la visualisation web des modèles ;
- offrir une expérience en réalité augmentée sur mobile ;
- faciliter le partage des modèles via liens et QR Codes ;
- proposer un tableau de bord clair pour les utilisateurs et les administrateurs ;
- intégrer des outils supplémentaires comme le chatbot et le formulaire de contact.

---

## 5. Besoins du projet

### 5.1 Besoins fonctionnels

Le système doit permettre :

- l’inscription et la connexion des utilisateurs ;
- la gestion des rôles ;
- l’accès à un dashboard administrateur ;
- l’accès à un dashboard utilisateur ;
- le téléversement de fichiers 3D ;
- la conversion des fichiers ;
- la visualisation 3D sur le web ;
- l’affichage en réalité augmentée sur mobile ;
- la génération de QR Codes ;
- le contact via formulaire ;
- l’assistance via chatbot.

### 5.2 Besoins non fonctionnels

Le système doit également garantir :

- la sécurité des accès ;
- une interface simple et ergonomique ;
- une bonne organisation du code ;
- la compatibilité avec différents appareils ;
- des performances satisfaisantes ;
- une structure évolutive et maintenable.

---

## 6. Services proposés par la plateforme

### 6.1 Conversion Multi-Format

JOJMA accepte plus de 10 formats 3D, notamment STL, FBX, OBJ et PLY. La plateforme convertit ensuite ces fichiers vers des formats optimisés pour une utilisation web et mobile.

Les formats de sortie les plus importants sont :

- GLB pour Android et le web ;
- USDZ pour iOS.

### 6.2 Visualisation en Réalité Augmentée

La plateforme permet d’afficher un modèle 3D dans un environnement réel directement depuis un smartphone. Cette fonctionnalité ne nécessite pas d’installation d’application tierce, ce qui améliore considérablement l’accessibilité.

### 6.3 Partage et Intégration

Pour chaque modèle, JOJMA génère :

- un lien unique ;
- un QR Code.

Ces éléments peuvent être partagés avec des clients ou intégrés à un site e-commerce pour enrichir l’expérience utilisateur.

### 6.4 Création de Modèles 3D

La plateforme prévoit aussi la mise en relation avec des experts capables de transformer des produits physiques en fichiers 3D exploitables.

### 6.5 Tableau de Bord de Gestion

L’utilisateur dispose d’un espace de gestion pour :

- suivre ses fichiers ;
- consulter l’état des conversions ;
- organiser son catalogue ;
- accéder aux liens et QR Codes générés.

---

## 7. Technologies utilisées

## 7.1 Frontend

Le frontend a été développé avec :

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

Le choix de React.js permet de créer une interface dynamique, moderne et réactive. Tailwind CSS facilite la création d’un design rapide, propre et responsive. Axios est utilisé pour la communication avec l’API backend, tandis que React Router gère la navigation entre les différentes pages.

## 7.2 Backend

Le backend a été développé avec :

- Node.js
- Express.js
- JWT
- Multer

Node.js et Express.js ont été choisis pour leur rapidité, leur flexibilité et leur compatibilité avec une architecture API moderne. JWT permet de sécuriser l’authentification, tandis que Multer gère le téléversement des fichiers.

## 7.3 Base de données

La base de données utilisée est :

- MySQL

Elle permet de stocker les informations relatives aux utilisateurs, aux rôles, aux fichiers téléversés, aux conversions et aux autres données du système.

## 7.4 Outils complémentaires

D’autres outils ont été utilisés pour enrichir le projet :

- Blender
- Bibliothèque de génération de QR Code
- Git / GitHub

Blender joue un rôle important dans certains traitements liés aux fichiers 3D, tandis que Git et GitHub assurent la gestion du code source et le suivi des versions.

---

## 8. Architecture du projet

La structure du projet comprend plusieurs dossiers et fichiers principaux :

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