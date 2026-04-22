// Internationalization (i18n) Module
// Loads translations.json and manages language switching

class I18n {
  constructor() {
    this.translations = null;
    this.currentLanguage = null;
    this.supportedLanguages = ['en', 'es', 'fr', 'de', 'it'];
    this.defaultLanguage = 'en';
    this.storageKey = 'nextvibe_language';
  }

  // Load translations from JSON file
  async init() {
    try {
      const response = await fetch('/translations.json');
      this.translations = await response.json();
      this.detectLanguage();
      this.applyTranslations();
      this.setupLanguageSwitcher();
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }

  // Detect language from URL path or localStorage, or use default
  detectLanguage() {
    // Check URL path for language code
    const pathMatch = window.location.pathname.match(/\/(en|es|fr|de|it)\//);
    if (pathMatch && this.supportedLanguages.includes(pathMatch[1])) {
      this.currentLanguage = pathMatch[1];
    } else {
      // Check localStorage
      const saved = localStorage.getItem(this.storageKey);
      if (saved && this.supportedLanguages.includes(saved)) {
        this.currentLanguage = saved;
      } else {
        // Use browser language preference if available
        const browserLang = navigator.language.split('-')[0];
        this.currentLanguage = this.supportedLanguages.includes(browserLang) ? browserLang : this.defaultLanguage;
      }
    }
    localStorage.setItem(this.storageKey, this.currentLanguage);
    document.documentElement.lang = this.currentLanguage;
  }

  // Get translation for a key (supports nested keys with dot notation)
  // Example: t('nav.services') returns translations[currentLanguage].nav.services
  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return key as fallback
      }
    }

    return value || key;
  }

  // Apply translations to all elements with data-i18n attribute
  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);

      // Determine if this is a placeholder, value, or text content
      if (el.getAttribute('data-i18n-attr') === 'placeholder') {
        el.placeholder = translation;
      } else if (el.getAttribute('data-i18n-attr') === 'title') {
        el.title = translation;
      } else if (el.getAttribute('data-i18n-attr') === 'value') {
        el.value = translation;
      } else {
        // Default to text content
        el.textContent = translation;
      }
    });

    // Update page title if data attribute exists
    const pageTitle = document.querySelector('[data-i18n-page-title]');
    if (pageTitle) {
      const titleKey = pageTitle.getAttribute('data-i18n-page-title');
      document.title = this.t(titleKey);
    }
  }

  // Setup language switcher dropdown in header
  setupLanguageSwitcher() {
    const nav = document.querySelector('nav#mainNav');
    if (!nav) return;

    // Create language switcher container
    const switcher = document.createElement('div');
    switcher.className = 'language-switcher';
    switcher.innerHTML = `
      <button class="lang-toggle" aria-label="Select language" title="Language">
        <span class="lang-flag">${this.getLanguageFlag(this.currentLanguage)}</span>
        <span class="lang-code">${this.currentLanguage.toUpperCase()}</span>
        <svg class="lang-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div class="lang-menu">
        ${this.supportedLanguages.map(lang => `
          <button class="lang-option" data-lang="${lang}" ${lang === this.currentLanguage ? 'aria-current="true"' : ''}>
            <span class="lang-option-flag">${this.getLanguageFlag(lang)}</span>
            <span class="lang-option-name">${this.getLanguageName(lang)}</span>
          </button>
        `).join('')}
      </div>
    `;

    nav.appendChild(switcher);

    // Add event listeners
    const toggle = switcher.querySelector('.lang-toggle');
    const menu = switcher.querySelector('.lang-menu');
    const options = switcher.querySelectorAll('.lang-option');

    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });

    options.forEach(option => {
      option.addEventListener('click', () => {
        const lang = option.getAttribute('data-lang');
        this.switchLanguage(lang);
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!switcher.contains(e.target)) {
        menu.classList.remove('open');
      }
    });
  }

  // Switch language and reload translations
  switchLanguage(lang) {
    if (!this.supportedLanguages.includes(lang)) return;

    this.currentLanguage = lang;
    localStorage.setItem(this.storageKey, lang);
    document.documentElement.lang = lang;

    // Update language switcher UI
    const langCode = document.querySelector('.lang-toggle .lang-code');
    if (langCode) langCode.textContent = lang.toUpperCase();
    const langFlag = document.querySelector('.lang-toggle .lang-flag');
    if (langFlag) langFlag.textContent = this.getLanguageFlag(lang);

    document.querySelectorAll('.lang-option').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.setAttribute('aria-current', 'true');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    // Reapply all translations
    this.applyTranslations();

    // Close menu
    const menu = document.querySelector('.lang-menu');
    if (menu) menu.classList.remove('open');
  }

  // Get friendly language name
  getLanguageName(code) {
    const names = {
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'it': 'Italiano'
    };
    return names[code] || code;
  }

  // Get country flag emoji for language
  getLanguageFlag(code) {
    const flags = {
      'en': '🇬🇧',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'it': '🇮🇹'
    };
    return flags[code] || '🌐';
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Set current language (for programmatic use)
  setLanguage(lang) {
    this.switchLanguage(lang);
  }
}

// Initialize i18n when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new I18n();
    window.i18n.init();
  });
} else {
  window.i18n = new I18n();
  window.i18n.init();
}
