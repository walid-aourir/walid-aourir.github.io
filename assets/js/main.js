/* ==========================================================================
   NextGen iOS Apps — Interactive Language & Theme Manager, Simulator & Forms
   ========================================================================== */

(function () {
  const root = document.documentElement;
  const THEME_KEY = 'callerid_web_theme';
  const LANG_KEY = 'nextgen_web_lang';

  // 1. Language Management (English / Arabic)
  function resolveLanguage(pref) {
    if (pref === 'ar' || pref === 'en') return pref;
    // Check URL query parameter ?lang=ar or ?lang=en
    const urlParams = new URLSearchParams(window.location.search);
    const queryLang = urlParams.get('lang');
    if (queryLang === 'ar' || queryLang === 'en') return queryLang;
    // Check browser navigator language
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('ar')) return 'ar';
    return 'en';
  }

  function applyLanguage(lang) {
    const active = resolveLanguage(lang);
    root.setAttribute('lang', active);
    root.setAttribute('dir', active === 'ar' ? 'rtl' : 'ltr');
    try {
      localStorage.setItem(LANG_KEY, active);
    } catch (_) {}

    document.querySelectorAll('[data-lang-set]').forEach((btn) => {
      const target = btn.getAttribute('data-lang-set');
      btn.classList.toggle('active', target === active);
      btn.setAttribute('aria-pressed', target === active ? 'true' : 'false');
    });

    // Update dynamic placeholders if needed
    document.querySelectorAll('[data-lang-placeholder-en]').forEach((input) => {
      const enPlaceholder = input.getAttribute('data-lang-placeholder-en');
      const arPlaceholder = input.getAttribute('data-lang-placeholder-ar');
      if (active === 'ar' && arPlaceholder) {
        input.setAttribute('placeholder', arPlaceholder);
      } else if (enPlaceholder) {
        input.setAttribute('placeholder', enPlaceholder);
      }
    });
  }

  // 2. Theme Management (Dark / Light / System)
  function resolveTheme(pref) {
    if (pref === 'light' || pref === 'dark') return pref;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(pref) {
    const active = resolveTheme(pref);
    root.setAttribute('data-theme', active);
    root.setAttribute('data-theme-pref', pref);
    try {
      localStorage.setItem(THEME_KEY, pref);
    } catch (_) {}

    document.querySelectorAll('[data-theme-set]').forEach((btn) => {
      const target = btn.getAttribute('data-theme-set');
      btn.classList.toggle('active', target === pref);
      btn.setAttribute('aria-pressed', target === pref ? 'true' : 'false');
    });
  }

  // Initial Bootstrapping
  let initialTheme = 'dark';
  try {
    initialTheme = localStorage.getItem(THEME_KEY) || 'dark';
  } catch (_) {}
  applyTheme(initialTheme);

  let initialLang = 'en';
  try {
    const stored = localStorage.getItem(LANG_KEY);
    initialLang = resolveLanguage(stored);
  } catch (_) {
    initialLang = resolveLanguage();
  }
  applyLanguage(initialLang);

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(root.getAttribute('data-theme-pref') || 'dark');
    applyLanguage(root.getAttribute('lang') || 'en');

    // Language Toggle Clicks
    document.querySelectorAll('[data-lang-set]').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyLanguage(btn.getAttribute('data-lang-set'));
      });
    });

    // Theme Toggle Clicks
    document.querySelectorAll('[data-theme-set]').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyTheme(btn.getAttribute('data-theme-set'));
      });
    });

    // 3. Interactive Caller ID Simulator
    const simInput = document.getElementById('sim-phone-input');
    const simBtn = document.getElementById('sim-run-btn');
    const outName = document.getElementById('sim-out-name');
    const outReputation = document.getElementById('sim-out-reputation');
    const outRoute = document.getElementById('sim-out-route');

    const presets = {
      '+1 (415) 890-4321': {
        name_en: 'Apex Global Logistics • Verified Business (US)',
        name_ar: 'أبيكس للخدمات اللوجستية • نشاط تجاري موثق (الولايات المتحدة)',
        rep_en: '0/100 Safe • Verified Carrier (AT&T Mobility)',
        rep_ar: '0/100 آمن • مشغل موثق (AT&T Mobility)',
        repColor: '#10B981',
        route_en: '4.8 km • 9 min Drive (Consent-Verified GPS Fix)',
        route_ar: '4.8 كم • 9 دقائق بالسيارة (إحداثيات بموافقة المستخدم)'
      },
      '+44 20 7946 0192': {
        name_en: 'Suspected Robocall / Financial Phishing (UK)',
        name_ar: 'اشتباه مكالمة احتيالية / تصيد مالي (المملكة المتحدة)',
        rep_en: '96/100 High Risk • Auto-Blocked by CallKit Shield',
        rep_ar: '96/100 خطر مرتفع • حظر تلقائي بواسطة درع CallKit',
        repColor: '#F43F5E',
        route_en: 'Location Sharing Disabled by Target',
        route_ar: 'مشاركة الموقع معطلة من قبل الرقم المستهدف'
      },
      '+212 661-234567': {
        name_en: 'Verified Mobile Subscriber • iPhone 16 Pro Max (Casablanca, MA)',
        name_ar: 'مشترك هاتف موثق • iPhone 16 Pro Max (الدار البيضاء، المغرب)',
        rep_en: '0/100 Safe • Verified Community Member',
        rep_ar: '0/100 آمن • عضو مجتمعي موثق',
        repColor: '#00D4FF',
        route_en: '3.2 km • 7 min Drive • Turn-by-Turn Path Ready',
        route_ar: '3.2 كم • 7 دقائق بالسيارة • المسار جاهز خطوة بخطوة'
      }
    };

    function runSimulation(rawValue) {
      if (!outName || !outReputation || !outRoute) return;
      const isArabic = root.getAttribute('lang') === 'ar';
      const val = (rawValue || '').trim();
      const matched = presets[val];

      if (matched) {
        outName.textContent = isArabic ? matched.name_ar : matched.name_en;
        outReputation.textContent = isArabic ? matched.rep_ar : matched.rep_en;
        outReputation.style.color = matched.repColor;
        outRoute.textContent = isArabic ? matched.route_ar : matched.route_en;
      } else {
        outName.textContent = isArabic ? 'رقم دولي موثق • بصيغة E.164' : 'Verified International Mobile • E.164 Normalized';
        outReputation.textContent = isArabic ? '4/100 سمعة نظيفة • جاهز لمزامنة CallKit' : '4/100 Clean Reputation • Ready for CallKit Sync';
        outReputation.style.color = '#10B981';
        outRoute.textContent = isArabic ? 'موقع خاضع لموافقة الطرف الآخر • اضغط لطلب المسار' : 'Consent-Gated Last-Known Location • Tap to Request Path';
      }
    }

    if (simBtn && simInput) {
      simBtn.addEventListener('click', () => runSimulation(simInput.value));
      document.querySelectorAll('[data-sim-preset]').forEach((chip) => {
        chip.addEventListener('click', () => {
          const val = chip.getAttribute('data-sim-preset');
          simInput.value = val;
          runSimulation(val);
        });
      });
    }

    // 4. Contact Us / Support Form Handler
    const contactForm = document.getElementById('legal-contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const appChoice = document.getElementById('contact-app')?.value || 'All Apps';
        const category = document.getElementById('contact-category')?.value || 'Support';
        const name = document.getElementById('contact-name')?.value || '';
        const email = document.getElementById('contact-email')?.value || '';
        const message = document.getElementById('contact-message')?.value || '';

        const subject = `[${appChoice} - ${category}] Support Request from ${name}`;
        const body = [
          `Application: ${appChoice}`,
          `Category: ${category}`,
          `Name: ${name}`,
          `Reply Email: ${email}`,
          `Timestamp: ${new Date().toISOString()}`,
          '',
          'Message / Details:',
          message
        ].join('\n');

        const statusEl = document.getElementById('contact-status');
        if (statusEl) {
          statusEl.style.display = 'block';
          const isAr = root.getAttribute('lang') === 'ar';
          statusEl.textContent = isAr 
            ? 'جاري فتح برنامج البريد الإلكتروني لمراسلة walid.aourir1993@gmail.com وتم نسخ التفاصيل للحافظة...'
            : 'Opening your email client addressed to walid.aourir1993@gmail.com and copying ticket details to your clipboard...';
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(`To: walid.aourir1993@gmail.com\nSubject: ${subject}\n\n${body}`).catch(() => {});
        }

        window.location.href = `mailto:walid.aourir1993@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
    }
  });
})();
