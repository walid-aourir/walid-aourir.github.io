/* ==========================================================================
   CallerID — Interactive Theme Manager, Lookup Demo & Legal Ticket Builder
   ========================================================================== */

(function () {
  // 1. Theme Management (Dark / Light / System)
  const STORAGE_KEY = 'callerid_web_theme';
  const root = document.documentElement;

  function resolveTheme(pref) {
    if (pref === 'light' || pref === 'dark') return pref;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(pref) {
    const active = resolveTheme(pref);
    root.setAttribute('data-theme', active);
    root.setAttribute('data-theme-pref', pref);
    try {
      localStorage.setItem(STORAGE_KEY, pref);
    } catch (_) {}

    document.querySelectorAll('[data-theme-set]').forEach((btn) => {
      const target = btn.getAttribute('data-theme-set');
      btn.classList.toggle('active', target === pref);
      btn.setAttribute('aria-pressed', target === pref ? 'true' : 'false');
    });
  }

  let initialPref = 'dark';
  try {
    initialPref = localStorage.getItem(STORAGE_KEY) || 'dark';
  } catch (_) {}
  applyTheme(initialPref);

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(root.getAttribute('data-theme-pref') || 'dark');

    document.querySelectorAll('[data-theme-set]').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyTheme(btn.getAttribute('data-theme-set'));
      });
    });

    // 2. Interactive Caller ID & GPS Route Simulator on Landing Page
    const simInput = document.getElementById('sim-phone-input');
    const simBtn = document.getElementById('sim-run-btn');
    const outName = document.getElementById('sim-out-name');
    const outReputation = document.getElementById('sim-out-reputation');
    const outRoute = document.getElementById('sim-out-route');

    const presets = {
      '+1 (415) 890-4321': {
        name: 'Apex Global Logistics • Verified Business (US)',
        rep: '0/100 Safe • Verified Carrier (AT&T Mobility)',
        repColor: '#10B981',
        route: '4.8 km • 9 min Drive (Consent-Verified GPS Fix)'
      },
      '+44 20 7946 0192': {
        name: 'Suspected Robocall / Financial Phishing (UK)',
        rep: '96/100 High Risk • Auto-Blocked by CallKit Shield',
        repColor: '#F43F5E',
        route: 'Location Sharing Disabled by Target'
      },
      '+212 661-234567': {
        name: 'Verified Mobile Subscriber • iPhone 16 Pro Max (Casablanca, MA)',
        rep: '0/100 Safe • Verified Community Member',
        repColor: '#00D4FF',
        route: '3.2 km • 7 min Drive • Turn-by-Turn Path Ready'
      }
    };

    function runSimulation(rawValue) {
      if (!outName || !outReputation || !outRoute) return;
      const val = (rawValue || '').trim();
      const matched = presets[val] || {
        name: 'Verified International Mobile • E.164 Normalized',
        rep: '4/100 Clean Reputation • Ready for CallKit Sync',
        repColor: '#10B981',
        route: 'Consent-Gated Last-Known Location • Tap to Request Path'
      };
      outName.textContent = matched.name;
      outReputation.textContent = matched.rep;
      outReputation.style.color = matched.repColor;
      outRoute.textContent = matched.route;
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

    // 3. Contact Us / Legal Request Form Handler
    const contactForm = document.getElementById('legal-contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.getElementById('contact-category')?.value || 'General Support';
        const name = document.getElementById('contact-name')?.value || '';
        const email = document.getElementById('contact-email')?.value || '';
        const phone = document.getElementById('contact-phone')?.value || 'N/A';
        const message = document.getElementById('contact-message')?.value || '';

        const subject = `[CallerID - ${category}] Request from ${name}`;
        const body = [
          `Category: ${category}`,
          `Full Name: ${name}`,
          `Reply Email: ${email}`,
          `Phone Number (E.164): ${phone}`,
          `App Bundle ID: com.calleddetector.callerid`,
          `Timestamp: ${new Date().toISOString()}`,
          '',
          'Request Details:',
          message
        ].join('\n');

        const statusEl = document.getElementById('contact-status');
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.textContent = 'Opening your email client addressed to walid.aourir1993@gmail.com and copying ticket details to your clipboard...';
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(`To: walid.aourir1993@gmail.com\nSubject: ${subject}\n\n${body}`).catch(() => {});
        }

        window.location.href = `mailto:walid.aourir1993@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
    }
  });
})();
