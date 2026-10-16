const I18N = (() => {
  const STORAGE_KEY = 'divide-and-conquer-language';
  const SUPPORTED = ['pl', 'en'];
  let language = 'en';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED.includes(saved)) language = saved;
  } catch {
    // Storage blocked: stay on the default language.
  }

  function t(key, variables = {}) {
    const value = TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en[key] ?? key;
    return Object.entries(variables).reduce(
      (text, [name, replacement]) => text.replaceAll(`{${name}}`, replacement),
      value
    );
  }

  function apply(root = document) {
    root.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = t(element.dataset.i18n);
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    root.querySelectorAll('[data-i18n-aria]').forEach(element => {
      element.setAttribute('aria-label', t(element.dataset.i18nAria));
    });
    root.querySelectorAll('[data-i18n-content]').forEach(element => {
      element.setAttribute('content', t(element.dataset.i18nContent));
    });
    const titleKey = document.body.dataset.titleKey;
    if (titleKey) document.title = t(titleKey);
    document.documentElement.lang = language;
  }

  function ensureHeaderTools(header) {
    let tools = header.querySelector('.header-tools');
    if (!tools) {
      tools = document.createElement('div');
      tools.className = 'header-tools';
      header.appendChild(tools);
    }
    return tools;
  }

  function updateToggle(button) {
    const english = language === 'en';
    button.innerHTML = english
      ? `<svg viewBox="0 0 30 20" aria-hidden="true">
          <path fill="#fff" d="M0 0h30v10H0z"/>
          <path fill="#dc143c" d="M0 10h30v10H0z"/>
        </svg>`
      : `<svg viewBox="0 0 38 20" aria-hidden="true">
          <path fill="#b22234" d="M0 0h38v20H0z"/>
          <path stroke="#fff" stroke-width="1.54" d="M0 2.31h38M0 5.38h38M0 8.46h38M0 11.54h38M0 14.62h38M0 17.69h38"/>
          <path fill="#3c3b6e" d="M0 0h15.2v10.77H0z"/>
          <path stroke="#fff" stroke-width="1.1" stroke-linecap="round"
            d="M1.9 1.35h0m3.8 0h0m3.8 0h0m3.8 0h0M3.8 4.04h0m3.8 0h0m3.8 0h0M1.9 6.73h0m3.8 0h0m3.8 0h0m3.8 0h0M3.8 9.42h0m3.8 0h0m3.8 0h0"/>
        </svg>`;
    button.setAttribute('aria-label', t('language.switch'));
    button.title = t('language.switch');
  }

  function setLanguage(nextLanguage) {
    if (!SUPPORTED.includes(nextLanguage) || nextLanguage === language) return;
    language = nextLanguage;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Storage blocked: the choice lasts until the page closes.
    }
    apply();
    document.querySelectorAll('.language-toggle').forEach(updateToggle);
    document.dispatchEvent(new CustomEvent('languagechange', { detail: { language } }));
  }

  function createToggle() {
    const header = document.querySelector('.site-header, .status-bar, .grid-nav');
    if (!header) return;

    function makeButton(extraClass = '') {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `language-toggle ${extraClass}`.trim();
      updateToggle(button);
      button.addEventListener('click', () => setLanguage(language === 'pl' ? 'en' : 'pl'));
      return button;
    }

    ensureHeaderTools(header).appendChild(makeButton());

    const authBox = document.querySelector('#auth-modal .modal-box');
    if (authBox) authBox.appendChild(makeButton('language-toggle-modal'));
  }

  function init() {
    apply();
    createToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  return {
    t,
    apply,
    setLanguage,
    getLanguage: () => language,
    ensureHeaderTools,
  };
})();

if (typeof module !== 'undefined') module.exports = I18N;
