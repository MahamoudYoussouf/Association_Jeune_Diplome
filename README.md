# 🇩🇯 Association des Jeunes Diplômés de Djibouti — Formulaire d'inscription

Formulaire d'inscription bilingue (Français / Anglais), dynamique, multi-étapes, avec galerie photo et vidéo.

---

## 📁 Structure du projet

```
association-djibouti/
├── index.html          ← Page principale
├── css/
│   └── style.css       ← Styles (thème coloré & dynamique)
├── js/
│   └── main.js         ← Logique (formulaire, i18n, validation)
└── README.md
```

---

## 🚀 Mettre en ligne sur GitHub Pages

1. Créez un nouveau dépôt public sur [github.com](https://github.com)
2. Glissez-y tous les fichiers (index.html, css/, js/)
3. Allez dans **Settings → Pages**
4. Source : branche `main`, dossier `/ (root)`
5. Cliquez **Save** — votre site sera disponible sur `https://votre-username.github.io/nom-du-repo/`

---

## 📊 Connexion à Google Sheets (pour sauvegarder les inscriptions)

### Étape 1 — Créer le Google Sheet

1. Ouvrez [Google Sheets](https://sheets.google.com) et créez un nouveau fichier
2. Nommez-le `Inscriptions AJD Djibouti`
3. En ligne 1, ajoutez ces en-têtes dans cet ordre :
   ```
   Horodatage | Nom complet | Email | Téléphone | Diplôme | Université | Année | Domaine | LinkedIn | Twitter | Instagram | Facebook | CV | Langue
   ```

### Étape 2 — Créer le Google Apps Script

1. Dans le Google Sheet, allez dans **Extensions → Apps Script**
2. Supprimez le code existant et collez le code suivant :

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = e.parameter;
  sheet.appendRow([
    data.timestamp,
    data.fullname,
    data.email,
    data.phone,
    data.diploma,
    data.university,
    data.year,
    data.domain,
    data.linkedin,
    data.twitter,
    data.instagram,
    data.facebook,
    data.cvFile,
    data.lang
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Cliquez sur **Déployer → Nouveau déploiement**
4. Type : **Application Web**
5. Accès : **Tout le monde** (Anyone)
6. Cliquez **Déployer** et copiez l'URL générée

### Étape 3 — Connecter le formulaire

Dans le fichier `js/main.js`, ligne 8, remplacez :
```javascript
const GOOGLE_SCRIPT_URL = 'VOTRE_URL_GOOGLE_SCRIPT';
```
par l'URL copiée :
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/XXXXXX/exec';
```

---

## 🎨 Personnalisation

| Ce que vous pouvez changer | Où |
|---|---|
| Nom de l'association | `index.html` → balise `<title>` et textes hero |
| Couleurs | `css/style.css` → variables `:root` (ex: `--c-orange`, `--c-teal`) |
| Photos de la galerie | `index.html` → attributs `src` des balises `<img>` |
| Vidéo YouTube | `index.html` → `src` de la balise `<iframe>` (remplacez `dQw4w9WgXcQ` par votre ID YouTube) |
| Statistiques (500+, 12, 3) | `index.html` → section `.stats` |

---

## 🌐 Langues

Le formulaire est bilingue **Français / Anglais**. Pour ajouter une langue :
1. Ajoutez un bouton dans `.lang-toggle` avec `data-lang="ar"` (ex: arabe)
2. Ajoutez des attributs `data-ar="..."` sur chaque élément texte dans `index.html`
3. La fonction `applyLanguage()` dans `main.js` s'en chargera automatiquement

---

## ✅ Fonctionnalités

- ✅ Formulaire multi-étapes (3 étapes) avec validation
- ✅ Bilingue Français / Anglais
- ✅ Aperçu de la photo de profil
- ✅ Upload CV (PDF, DOC, DOCX)
- ✅ Galerie d'images avec effet hover
- ✅ Vidéo YouTube intégrée
- ✅ Domaines d'activité cliquables
- ✅ Intégration Google Sheets
- ✅ Animations au défilement
- ✅ 100% responsive (mobile/desktop)
- ✅ Aucune dépendance externe (fonctionne offline sauf les polices Google)

---

*Projet créé pour l'Association des Jeunes Diplômés de Djibouti 🇩🇯*
