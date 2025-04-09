# 🗺️ Projet Humanité Numérique – Évolution des Communes en Haute-Corse

## 📌 Objectif

Ce projet vise à recenser et visualiser l'évolution historique des communes pour la **Haute-Corse (2B)** à partir des données disponibles sur les pages Wikipedia. À travers une interface cartographique interactive, l’utilisateur peut consulter les communes existantes à une date donnée.

## 🧠 Contexte

Depuis la Révolution française, les communes ont connu de nombreuses évolutions : fusions, changements de nom, disparitions, transferts de département… Ces transformations sont listées sur Wikipedia, mais difficilement exploitables de manière intuitive. Ce projet a pour but de structurer ces informations dans des fichiers JSON et de les rendre consultables via une application web développée en React et Python.

## ⚙️ Fonctionnalités

- 🔍 **Scraping automatique** des données depuis les pages Wikipedia des anciennes communes de Corse.
- 📁 **Stockage local en fichiers JSON** des données extraites.
- 📅 **Filtrage par date** pour retrouver les communes existantes à un instant T.
- 🗺️ **Visualisation dynamique sur carte** à l’aide de **Leaflet.js**.
- 🌐 **Requête à l’API Géo** du gouvernement pour compléter les informations actuelles.

## 🛠️ Technologies utilisées

| Outil / Langage         | Utilisation                          |
|-------------------------|--------------------------------------|
| `Python`                | Scraping (BeautifulSoup), génération de fichiers JSON |
| `JSON`                  | Format de stockage des données       |
| `React` + `TypeScript`  | Application frontend                 |
| `Leaflet.js`            | Carte interactive                    |
| `HTML/CSS`              | Interface utilisateur                |
| `API Géo`               | Données officielles des communes     |

## 🖥️ Utilisation

1. Clonez ce dépôt :  
   ```bash
   git clone <url-du-repo>
   cd Projet Corse
   ```

2. Installez les dépendances frontend :  
   ```bash
   cd project
   npm install
   npm run dev
   ```

3. Générez les fichiers JSON (si nécessaire) :  
   ```bash
   python backend/scraping.py
   ```


## 🔗 Liens utiles

- 🔗 [Liste des anciennes communes de France – Wikipedia](https://fr.wikipedia.org/wiki/Listes_des_anciennes_communes_de_France)
- 🔗 [API Géo (gouv.fr)](https://api.gouv.fr/documentation/api-geo)
- 🔗 [Leaflet – Librairie JS de cartographie](https://leafletjs.com/)
