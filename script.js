/**
 * PORTFÓLIO PREMIUM — FASE 5 (FINAL)
 * Performance · SEO helpers · Otimizações de runtime
 */

(function () {
  'use strict';

  /* ==================== ELEMENTOS DOM ==================== */

  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const cursorGlow = document.getElementById('cursorGlow');
  const heroRevealElements = document.querySelectorAll('#hero .reveal');
  const scrollRevealElements = document.querySelectorAll('.reveal-scroll');
  const navLinks = document.querySelectorAll('.nav__link, .hero__scroll, .btn, .footer__link, .footer__logo');
  const contactForm = document.getElementById('contactForm');
  const backToTop = document.getElementById('backToTop');
  const footerYear = document.getElementById('footerYear');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;


  /* ==================== INICIALIZAÇÃO — FADE IN ==================== */

  function initPageReady() {
    document.body.classList.add('is-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageReady);
  } else {
    initPageReady();
  }


  /* ==================== NAVBAR — SCROLL EFFECT (throttled) ==================== */

  let scrollTicking = false;

  function updateHeaderOnScroll() {
    if (!header) return;
    header.classList.toggle('header--scrolled', window.scrollY > 20);
    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateHeaderOnScroll);
      scrollTicking = true;
    }
  }, { passive: true });

  updateHeaderOnScroll();


  /* ==================== NAVBAR — MOBILE MENU ==================== */

  function closeMobileMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
    navMenu.classList.remove('nav__menu--open');
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fechar menu');
    navMenu.classList.add('nav__menu--open');
    document.body.style.overflow = 'hidden';
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMobileMenu() : openMobileMenu();
    });

    navMenu.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }


  /* ==================== SMOOTH SCROLL ==================== */

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-height'), 10) || 64;

      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ==================== NAV — LINK ATIVO NO SCROLL ==================== */

  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const menuLinks = document.querySelectorAll('.nav__link[href^="#"]');
    if (!sections.length || !menuLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.getAttribute('id');
          menuLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === '#' + id;
            link.classList.toggle('nav__link--active', isActive);
            if (isActive) {
              link.setAttribute('aria-current', 'page');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  initActiveNav();


  /* ==================== HERO — REVEAL ON LOAD ==================== */

  function initHeroReveal() {
    heroRevealElements.forEach((el) => {
      const delay = parseInt(el.dataset.revealDelay || '0', 10);
      setTimeout(() => {
        el.classList.add('reveal--visible');
      }, 200 + delay * 120);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(initHeroReveal);
    });
  } else {
    requestAnimationFrame(initHeroReveal);
  }


  /* ==================== REVEAL ON SCROLL ==================== */

  function initScrollReveal() {
    if (!scrollRevealElements.length) return;

    if (prefersReducedMotion) {
      scrollRevealElements.forEach((el) => el.classList.add('reveal-scroll--visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const delay = parseInt(el.dataset.revealDelay || '0', 10);

          setTimeout(() => {
            el.classList.add('reveal-scroll--visible');
          }, delay * 100);

          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    scrollRevealElements.forEach((el) => observer.observe(el));
  }

  initScrollReveal();


  /* ==================== SKILL BARS ANIMADAS ==================== */

  function animateSkillBar(bar) {
    const fill = bar.querySelector('.skill-bar__fill');
    const valueEl = bar.querySelector('.skill-bar__value');
    const progress = parseInt(fill?.dataset.progress || '0', 10);

    if (!fill) return;

    if (prefersReducedMotion) {
      fill.style.width = progress + '%';
      if (valueEl) valueEl.textContent = progress + '%';
      return;
    }

    /* Pequeno delay para sincronizar com o reveal */
    setTimeout(() => {
      fill.style.width = progress + '%';

      if (valueEl) {
        const duration = 1200;
        const startTime = performance.now();

        function updateValue(currentTime) {
          const elapsed = currentTime - startTime;
          const pct = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - pct, 3);
          valueEl.textContent = Math.round(progress * eased) + '%';
          if (pct < 1) requestAnimationFrame(updateValue);
        }

        requestAnimationFrame(updateValue);
      }
    }, 200);
  }

  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar');

    if (!bars.length) return;

    if (prefersReducedMotion) {
      bars.forEach(animateSkillBar);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateSkillBar(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    bars.forEach((bar) => observer.observe(bar));
  }

  initSkillBars();


  /* ==================== PROJETOS — TILT 3D + SPOTLIGHT ==================== */

  function initProjectCards() {
    const cards = document.querySelectorAll('.project-card[data-tilt]');
    if (!cards.length || prefersReducedMotion || isTouchDevice) return;

    const maxTilt = 6;

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * maxTilt;
        const rotateX = ((centerY - y) / centerY) * maxTilt;

        card.style.setProperty('--tilt-x', rotateX + 'deg');
        card.style.setProperty('--tilt-y', rotateY + 'deg');
        card.style.setProperty('--spotlight-x', x + 'px');
        card.style.setProperty('--spotlight-y', y + 'px');
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        card.style.setProperty('--spotlight-x', '50%');
        card.style.setProperty('--spotlight-y', '50%');
      });
    });
  }

  initProjectCards();


  /* ==================== PROJETOS — PLACEHOLDER DE IMAGEM ==================== */

  document.querySelectorAll('.project-card__image').forEach((img) => {
    const showPlaceholder = () => {
      img.closest('.project-card__preview')?.classList.add('project-card__preview--empty');
    };

    if (img.complete && img.naturalHeight === 0) showPlaceholder();
    img.addEventListener('error', showPlaceholder);
  });


  /* ==================== PROJETOS — BARRAS DE EVOLUÇÃO ==================== */

  function initEvolutionLevels() {
    const fills = document.querySelectorAll('.project-card__level-fill');
    if (!fills.length) return;

    if (prefersReducedMotion) {
      fills.forEach((fill) => fill.classList.add('project-card__level-fill--animated'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll('.project-card__level-fill').forEach((fill) => {
            fill.classList.add('project-card__level-fill--animated');
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.25 }
    );

    document.querySelectorAll('.project-card').forEach((card) => observer.observe(card));
  }

  initEvolutionLevels();


  /* ==================== FORMULÁRIO DE CONTATO → WHATSAPP ==================== */

  const WHATSAPP_NUMBER = '5582993939007';

  function initContactForm() {
    if (!contactForm) return;

    const fields = {
      name: {
        el: document.getElementById('name'),
        error: document.getElementById('nameError'),
        validate: (v) => v.trim().length >= 2 || 'Informe seu nome (mín. 2 caracteres).'
      },
      email: {
        el: document.getElementById('email'),
        error: document.getElementById('emailError'),
        validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Informe um e-mail válido.'
      },
      subject: {
        el: document.getElementById('subject'),
        error: document.getElementById('subjectError'),
        validate: (v) => v.trim().length >= 3 || 'Informe a vaga ou empresa (mín. 3 caracteres).'
      },
      message: {
        el: document.getElementById('message'),
        error: document.getElementById('messageError'),
        validate: (v) => v.trim().length >= 10 || 'Descreva a oportunidade com mais detalhes (mín. 10 caracteres).'
      }
    };

    function clearFieldError(key) {
      const field = fields[key];
      if (!field.el || !field.error) return;
      field.el.classList.remove('form-input--error');
      field.error.textContent = '';
    }

    function showFieldError(key, message) {
      const field = fields[key];
      if (!field.el || !field.error) return;
      field.el.classList.add('form-input--error');
      field.error.textContent = message;
    }

    Object.keys(fields).forEach((key) => {
      fields[key].el?.addEventListener('input', () => clearFieldError(key));
    });

    const submitBtnOriginal = document.getElementById('formSubmit')?.innerHTML;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const successEl = document.getElementById('formSuccess');
      const submitBtn = document.getElementById('formSubmit');
      let isValid = true;

      if (successEl) successEl.hidden = true;

      Object.keys(fields).forEach((key) => {
        const field = fields[key];
        const result = field.validate(field.el.value);

        if (result === true) {
          clearFieldError(key);
        } else {
          showFieldError(key, result);
          isValid = false;
        }
      });

      if (!isValid) {
        const firstError = contactForm.querySelector('.form-input--error');
        firstError?.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Abrindo WhatsApp...';
      }

      const name = fields.name.el.value.trim();
      const email = fields.email.el.value.trim();
      const subject = fields.subject.el.value.trim();
      const message = fields.message.el.value.trim();

      const whatsappMessage =
        '*Contato via Portfólio*\n\n' +
        '*Nome:* ' + name + '\n' +
        '*E-mail:* ' + email + '\n' +
        '*Vaga / Empresa:* ' + subject + '\n\n' +
        '*Mensagem:*\n' + message;

      const whatsappUrl =
        'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(whatsappMessage);

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      contactForm.reset();
      Object.keys(fields).forEach(clearFieldError);

      if (successEl) {
        successEl.hidden = false;
        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      if (submitBtn && submitBtnOriginal) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtnOriginal;
      }
    });
  }

  initContactForm();


  /* ==================== FOOTER — ANO AUTOMÁTICO ==================== */

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }


  /* ==================== CURSOR GLOW (desktop only, otimizado) ==================== */

  if (cursorGlow && !prefersReducedMotion && !isTouchDevice) {
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    let glowActive = true;

    document.body.classList.add('cursor-active');

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    /* Pausa animação quando aba está oculta — economiza CPU */
    document.addEventListener('visibilitychange', () => {
      glowActive = !document.hidden;
      if (glowActive) requestAnimationFrame(animateGlow);
    });

    function animateGlow() {
      if (!glowActive) return;

      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateGlow);
    }

    requestAnimationFrame(animateGlow);
  }

})();
