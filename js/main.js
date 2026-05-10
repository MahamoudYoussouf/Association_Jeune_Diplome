/* ═══════════════════════════════════════════════════════════════
   Association des Jeunes Diplômés de Djibouti
   main.js — multi-step form, i18n, validation, Google Sheets
═══════════════════════════════════════════════════════════════ */

/* ─── CONFIG ───────────────────────────────────────────────────
   Remplacez VOTRE_URL_GOOGLE_SCRIPT par l'URL de déploiement
   de votre Google Apps Script (voir README.md pour les étapes).
──────────────────────────────────────────────────────────────── */
const GOOGLE_SCRIPT_URL = 'VOTRE_URL_GOOGLE_SCRIPT';

/* ─── LANGUAGE ─────────────────────────────────────────────── */
let currentLang = 'fr';

function applyLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-fr]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (!text) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = text;
    } else if (el.tagName === 'OPTION') {
      el.textContent = text;
    } else {
      el.innerHTML = text;
    }
  });

  // Update year select placeholder
  const yearSel = document.getElementById('year');
  if (yearSel) {
    const placeholder = yearSel.querySelector('option[value=""]');
    if (placeholder) {
      placeholder.textContent = lang === 'fr' ? 'Sélectionner' : 'Select';
    }
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

/* ─── POPULATE YEAR SELECT ─────────────────────────────────── */
(function populateYears() {
  const sel = document.getElementById('year');
  if (!sel) return;
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1990; y--) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    sel.appendChild(opt);
  }
})();

/* ─── SCROLL REVEAL ─────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── MULTI-STEP FORM ───────────────────────────────────────── */
let currentStep = 1;
const totalSteps = 3;

function showStep(n) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.querySelector(`.form-step[data-step="${n}"]`)?.classList.add('active');

  document.querySelectorAll('.step').forEach(dot => {
    const stepNum = parseInt(dot.dataset.step);
    dot.classList.toggle('active', stepNum === n);
    dot.classList.toggle('done',   stepNum < n);
  });

  document.querySelectorAll('.step__line').forEach((line, idx) => {
    line.classList.toggle('done', idx + 1 < n);
  });

  currentStep = n;
  window.scrollTo({ top: document.getElementById('form-section').offsetTop - 40, behavior: 'smooth' });
}

// Next / Back buttons
document.querySelectorAll('.btn--next').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = parseInt(btn.dataset.next);
    if (validateStep(currentStep)) showStep(next);
  });
});
document.querySelectorAll('.btn--back').forEach(btn => {
  btn.addEventListener('click', () => {
    const prev = parseInt(btn.dataset.prev);
    showStep(prev);
  });
});

/* ─── VALIDATION ────────────────────────────────────────────── */
function validateStep(step) {
  let valid = true;

  if (step === 1) {
    valid = checkRequired('fullname') && valid;
    valid = checkEmail('email')       && valid;
    valid = checkRequired('phone')    && valid;
  }

  if (step === 2) {
    valid = checkRequired('diploma')    && valid;
    valid = checkRequired('university') && valid;
    valid = checkSelect('year')         && valid;
    valid = checkDomain()               && valid;
  }

  if (step === 3) {
    valid = checkConsent() && valid;
  }

  return valid;
}

function checkRequired(id) {
  const el = document.getElementById(id);
  const err = el?.nextElementSibling;
  if (!el?.value.trim()) {
    el?.classList.add('error');
    if (err) err.textContent = currentLang === 'fr' ? 'Ce champ est requis.' : 'This field is required.';
    return false;
  }
  el.classList.remove('error');
  if (err) err.textContent = '';
  return true;
}

function checkEmail(id) {
  const el = document.getElementById(id);
  const err = el?.nextElementSibling;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!el?.value.trim()) {
    el?.classList.add('error');
    if (err) err.textContent = currentLang === 'fr' ? 'Ce champ est requis.' : 'This field is required.';
    return false;
  }
  if (!re.test(el.value)) {
    el.classList.add('error');
    if (err) err.textContent = currentLang === 'fr' ? 'Email invalide.' : 'Invalid email.';
    return false;
  }
  el.classList.remove('error');
  if (err) err.textContent = '';
  return true;
}

function checkSelect(id) {
  const el = document.getElementById(id);
  const err = el?.nextElementSibling;
  if (!el?.value) {
    el?.classList.add('error');
    if (err) err.textContent = currentLang === 'fr' ? 'Veuillez sélectionner une année.' : 'Please select a year.';
    return false;
  }
  el.classList.remove('error');
  if (err) err.textContent = '';
  return true;
}

function checkDomain() {
  const val = document.getElementById('domain')?.value;
  const errEl = document.getElementById('domainError');
  if (!val) {
    if (errEl) errEl.textContent = currentLang === 'fr' ? 'Veuillez choisir un domaine.' : 'Please choose a field.';
    return false;
  }
  if (errEl) errEl.textContent = '';
  return true;
}

function checkConsent() {
  const el = document.getElementById('consent');
  const errEl = document.getElementById('consentError');
  if (!el?.checked) {
    if (errEl) errEl.textContent = currentLang === 'fr' ? 'Veuillez accepter pour continuer.' : 'Please accept to continue.';
    return false;
  }
  if (errEl) errEl.textContent = '';
  return true;
}

// Clear error on input
document.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('input', () => {
    el.classList.remove('error');
    const err = el.nextElementSibling;
    if (err?.classList.contains('field__error')) err.textContent = '';
  });
});

/* ─── DOMAIN CHIPS ──────────────────────────────────────────── */
document.querySelectorAll('.domain-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.domain-chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    document.getElementById('domain').value = chip.dataset.value;
    const errEl = document.getElementById('domainError');
    if (errEl) errEl.textContent = '';
  });
});

/* ─── PHOTO PREVIEW ─────────────────────────────────────────── */
document.getElementById('photoInput')?.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    alert(currentLang === 'fr' ? 'Photo trop lourde (max 5 MB).' : 'Photo too large (max 5 MB).');
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const preview = document.getElementById('photoPreview');
    preview.innerHTML = `<img src="${e.target.result}" alt="Photo de profil" />`;
  };
  reader.readAsDataURL(file);
});

/* ─── CV LABEL ──────────────────────────────────────────────── */
document.getElementById('cvInput')?.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) {
    alert(currentLang === 'fr' ? 'Fichier trop lourd (max 10 MB).' : 'File too large (max 10 MB).');
    return;
  }
  const label = document.getElementById('cvLabel');
  if (label) label.textContent = `✅ ${file.name}`;
});

/* ─── DRAG & DROP ───────────────────────────────────────────── */
function setupDragDrop(zoneId, inputId) {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  if (!zone || !input) return;

  ['dragenter', 'dragover'].forEach(evt => {
    zone.addEventListener(evt, e => {
      e.preventDefault();
      zone.style.borderColor = 'var(--c-orange)';
      zone.style.background = 'rgba(255,107,53,.06)';
    });
  });
  ['dragleave', 'drop'].forEach(evt => {
    zone.addEventListener(evt, e => {
      e.preventDefault();
      zone.style.borderColor = '';
      zone.style.background = '';
    });
  });
  zone.addEventListener('drop', e => {
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event('change'));
  });
}

setupDragDrop('photoZone', 'photoInput');
setupDragDrop('cvZone',    'cvInput');

/* ─── FORM SUBMIT → GOOGLE SHEETS ──────────────────────────── */
document.getElementById('registrationForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  if (!validateStep(3)) return;

  const submitBtn = this.querySelector('.btn--submit');
  const originalHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span>${currentLang === 'fr' ? 'Envoi en cours…' : 'Sending…'}</span>`;

  /* Collect text data */
  const data = {
    timestamp:   new Date().toLocaleString('fr-DJ'),
    fullname:    document.getElementById('fullname')?.value || '',
    email:       document.getElementById('email')?.value || '',
    phone:       document.getElementById('phone')?.value || '',
    diploma:     document.getElementById('diploma')?.value || '',
    university:  document.getElementById('university')?.value || '',
    year:        document.getElementById('year')?.value || '',
    domain:      document.getElementById('domain')?.value || '',
    linkedin:    document.getElementById('linkedin')?.value || '',
    twitter:     document.getElementById('twitter')?.value || '',
    instagram:   document.getElementById('instagram')?.value || '',
    facebook:    document.getElementById('facebook')?.value || '',
    cvFile:      document.getElementById('cvInput')?.files[0]?.name || '',
    lang:        currentLang,
  };

  try {
    if (GOOGLE_SCRIPT_URL === 'VOTRE_URL_GOOGLE_SCRIPT') {
      /* Demo mode: no real script configured */
      await new Promise(r => setTimeout(r, 1200));
      showSuccess();
    } else {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, v));

      /* Attach CV file if present */
      const cvFile = document.getElementById('cvInput')?.files[0];
      if (cvFile) formData.append('cvData', cvFile);

      await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: formData });
      showSuccess();
    }
  } catch (err) {
    console.error(err);
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
    alert(
      currentLang === 'fr'
        ? 'Une erreur est survenue. Veuillez réessayer.'
        : 'An error occurred. Please try again.'
    );
  }
});

function showSuccess() {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  const success = document.getElementById('formSuccess');
  success?.classList.add('active');
  // Update steps UI
  document.querySelectorAll('.step').forEach(dot => {
    dot.classList.add('done');
    dot.classList.remove('active');
  });
  document.querySelectorAll('.step__line').forEach(l => l.classList.add('done'));
  window.scrollTo({ top: document.getElementById('form-section').offsetTop - 40, behavior: 'smooth' });
}

document.getElementById('resetBtn')?.addEventListener('click', () => {
  document.getElementById('registrationForm')?.reset();
  document.getElementById('photoPreview').innerHTML = `
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>`;
  const cvLabel = document.getElementById('cvLabel');
  if (cvLabel) cvLabel.setAttribute('data-fr', 'Glissez votre CV ici ou');
  document.querySelectorAll('.domain-chip').forEach(c => c.classList.remove('selected'));
  document.getElementById('formSuccess')?.classList.remove('active');
  showStep(1);
  applyLanguage(currentLang);
});

/* ─── INITIAL RENDER ────────────────────────────────────────── */
applyLanguage('fr');
