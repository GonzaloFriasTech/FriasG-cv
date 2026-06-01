(function () {
  'use strict';

  const D   = CLIENT_DATA;
  const P   = D.personal;
  const C   = D.contacto;
  const EXP = D.experiencia;
  const EDU = D.educacion;
  const SKL = D.skills;
  const SM  = D.sobre_mi;
  const BOT = D.chatbot;

  // ── Shared SVGs ─────────────────────────────────────────────────────────
  const CAL_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
  const SEND_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;

  // ── HTML builders ────────────────────────────────────────────────────────

  function companyIcon(icon) {
    if (icon.type === 'img')
      return `<div class="company-icon" style="background:transparent;padding:0"><img src="${icon.src}" alt="${icon.alt}" style="width:40px;height:40px;object-fit:contain;border-radius:8px"/></div>`;
    return `<div class="company-icon">${icon.value}</div>`;
  }

  function buildNav() {
    const isSubPage = /\/(chat|projects)(\.html)?$/.test(window.location.pathname);
    const b = isSubPage ? '/' : '';
    return `
<nav>
  <div class="nav-inner">
    <a href="https://interactivevitae.com" class="nav-logo-link" target="_blank" rel="noopener">
      <img src="logo.png" alt="Interactive Vitae" class="nav-logo" id="nav-logo" />
    </a>
    <div class="nav-links">
      <a href="${b}#experience" id="nav-exp">Experiencia</a>
      <a href="${b}#skills" id="nav-skills">Skills</a>
      <a href="${b}#sobre-mi" id="nav-formation">Mi Formación</a>
      <a href="${b}#sobre-mi" id="nav-about">Sobre mí</a>
      <a href="${b}#contact" id="nav-contact">Contacto</a>
      <a href="projects.html" id="nav-projects">Proyectos</a>
      <a href="chat.html" id="nav-agent">AI Agent</a>
    </div>
    <div class="nav-controls">
      <button class="btn-tour" id="tour-btn">✦ Tour</button>
      <button class="btn-toggle" id="lang-toggle">EN</button>
      <button class="btn-toggle" id="theme-toggle">🌙</button>
      <button class="nav-hamburger" id="hamburger-btn" aria-label="Menú">☰</button>
    </div>
  </div>
</nav>
<div class="nav-mobile-dropdown" id="mobile-menu">
  <a href="${b}#experience" class="mobile-nav-link" id="mnav-exp">Experiencia</a>
  <a href="${b}#skills" class="mobile-nav-link" id="mnav-skills">Skills</a>
  <a href="${b}#sobre-mi" class="mobile-nav-link" id="mnav-formation">Mi Formación</a>
  <a href="${b}#sobre-mi" class="mobile-nav-link" id="mnav-about">Sobre mí</a>
  <a href="${b}#contact" class="mobile-nav-link" id="mnav-contact">Contacto</a>
  <a href="projects.html" class="mobile-nav-link" id="mnav-projects">Proyectos</a>
  <a href="chat.html" class="mobile-nav-link" id="mnav-agent">AI Agent</a>
</div>
<div id="scroll-progress"></div>`;
  }

  function buildHero(lang) {
    const l    = lang === 'es';
    const bio  = l ? P.bio_es  : P.bio_en;
    const tit  = l ? P.titulo_es : P.titulo_en;
    const lbl  = l ? 'CV Interactivo' : 'Interactive CV';
    const name = P.nombre.replace(' ', '<br/>');
    return `
<section id="hero">
  <div class="hero-inner">
    <div class="fade-in">
      <p class="hero-label">${lbl}</p>
      <h1 class="hero-name">${name}</h1>
      <p class="hero-title">${tit}</p>
      <p class="hero-bio">${bio}</p>
    </div>
    <div class="hero-photo-wrap fade-in">
      <img src="${P.foto}" alt="${P.nombre}" />
    </div>
  </div>
</section>`;
  }

  function buildExperience(lang) {
    const l = lang === 'es';
    const companies = EXP.map(co => {
      const roles = co.roles.map(r => {
        const tags = (l ? r.tags_es : r.tags_en) || r.tags || [];
        return `
      <div class="exp-role">
        <div class="role-header">
          <span class="role-title">${l ? r.titulo_es : r.titulo_en}</span>
          <span class="role-date">${CAL_ICON} ${l ? r.fecha_es : r.fecha_en}</span>
        </div>
        <p class="role-desc">${l ? r.desc_es : r.desc_en}</p>
        <div class="tags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </div>`;
      }).join('');
      return `
    <div class="exp-company fade-in">
      <div class="exp-company-header">
        ${co.url ? `<a href="${co.url}" target="_blank" rel="noopener" style="display:contents">${companyIcon(co.icon)}</a>` : companyIcon(co.icon)}
        <div>
          <div class="company-name">${co.nombre}</div>
          <div class="company-period-row">
            <div class="company-period">${l ? co.periodo_es : co.periodo_en}</div>
            ${co.tag ? `<span class="company-tag">${co.tag}</span>` : ''}
          </div>
        </div>
      </div>
      ${roles}
    </div>`;
    }).join('');

    return `
<section id="experience">
  <div class="container">
    <p class="section-label fade-in">${l ? 'Carrera' : 'Career'}</p>
    <h2 class="section-title fade-in">${l ? 'Experiencia Profesional' : 'Professional Experience'}</h2>
    ${companies}
  </div>
</section>`;
  }

  function buildSkills(lang) {
    const l    = lang === 'es';
    const cards = SKL.map(s => {
      const items = (l ? s.items_es : s.items_en).map(i => `<li>${i}</li>`).join('');
      return `
      <div class="skill-card fade-in">
        <div class="skill-icon">${s.icon}</div>
        <h3>${l ? s.titulo_es : s.titulo_en}</h3>
        <ul class="skill-list">${items}</ul>
      </div>`;
    }).join('');

    return `
<section id="skills">
  <div class="container">
    <div style="text-align:center">
      <h2 class="section-title fade-in" style="margin-bottom:8px">${l ? 'Capacidades Principales' : 'Core Competencies'}</h2>
      <p class="fade-in" style="color:var(--text-mid);font-size:15px;max-width:500px;margin:0 auto 48px">
        ${l ? 'Habilidades desarrolladas en ventas B2B, expansión de negocios, gestión de proyectos en LATAM y construcción de productos con IA.' : 'Skills developed in B2B sales, business expansion, project management in LATAM and building products with AI.'}
      </p>
    </div>
    <div class="skills-grid">${cards}</div>
  </div>
</section>`;
  }

  function buildAbout(lang) {
    const l = lang === 'es';

    const institutions = EDU.instituciones.map(inst => {
      const desc = l ? inst.desc_es : inst.desc_en;
      return `
        <div class="edu-item">
          <div class="edu-school">${inst.nombre}</div>
          <div class="edu-degree">${l ? inst.titulo_es : inst.titulo_en}</div>
          <div class="edu-year">${inst.periodo}</div>
          ${desc ? `<div class="edu-desc">${desc}</div>` : ''}
        </div>`;
    }).join('');

    const certs  = EDU.certificaciones.map(c => `<div class="cert-item">${c}</div>`).join('');
    const hobbies = (l ? SM.hobbies_es : SM.hobbies_en).map(h => `<span class="hobby-tag">${h}</span>`).join('');
    const itags   = (l ? SM.intereses_tags_es : SM.intereses_tags_en).map(t => `<span class="hobby-tag">${t}</span>`).join('');

    return `
<section id="sobre-mi">
  <div class="container">
    <p class="section-label fade-in">${l ? 'Más allá del trabajo' : 'Beyond work'}</p>
    <h2 class="section-title fade-in">${l ? 'Sobre mí' : 'About Me'}</h2>
    <div class="sobre-grid">
      <div class="sobre-card fade-in">
        <h3><span class="card-icon">🎓</span> ${l ? 'Educación' : 'Education'}</h3>
        ${institutions}
        <div class="cert-section-label">${l ? 'Certificaciones' : 'Certifications'}</div>
        ${certs}
      </div>
      <div style="display:flex;flex-direction:column;gap:24px">
        <div class="sobre-card fade-in">
          <h3><span class="card-icon">🏉</span> ${l ? 'Deporte &amp; Vida al Aire Libre' : 'Sports &amp; Outdoor Life'}</h3>
          <p>${l ? SM.deportes_es : SM.deportes_en}</p>
          <p>${l ? SM.deportes2_es : SM.deportes2_en}</p>
          <div class="hobby-tags">${hobbies}</div>
        </div>
        <div class="sobre-card fade-in">
          <h3><span class="card-icon">💡</span> ${l ? 'Intereses &amp; Pasiones' : 'Interests &amp; Passions'}</h3>
          <p>${l ? SM.intereses_es : SM.intereses_en}</p>
          <div class="hobby-tags">${itags}</div>
        </div>
      </div>
    </div>
  </div>
</section>`;
  }

  function buildContact(lang) {
    const l     = lang === 'es';
    const waNum = C.whatsapp.replace(/\D/g, '');
    const waMsg = encodeURIComponent(l ? C.whatsapp_msg_es : C.whatsapp_msg_en);
    const waFmt = `+${waNum.slice(0,2)} ${waNum.slice(2,4)} ${waNum.slice(4,8)}-${waNum.slice(8)}`;
    const cvBtn = C.cv_pdf
      ? `<a href="${C.cv_pdf}" download class="btn-contact btn-secondary">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
           ${l ? 'Descargar CV' : 'Download CV'}
         </a>`
      : `<span class="btn-contact btn-secondary btn-disabled">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
           ${l ? 'Descargar CV (próximamente)' : 'Download CV (coming soon)'}
         </span>`;

    return `
<section id="contact">
  <div class="container">
    <p class="section-label fade-in">${l ? 'Contacto' : 'Contact'}</p>
    <h2 class="contact-title fade-in">${l ? 'Hablemos.' : "Let's talk."}</h2>
    <p class="contact-sub fade-in">${l
      ? 'Si estás buscando a alguien para impulsar tu negocio, expandir mercados o liderar tu equipo comercial, no dudes en escribirme.'
      : "If you're looking for someone to grow your business, expand markets or lead your sales team, don't hesitate to reach out."}</p>
    <div class="contact-buttons fade-in">
      <a href="mailto:${C.email}" class="btn-contact btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
        Email
      </a>
      <a href="${C.linkedin}" target="_blank" rel="noopener" class="btn-contact btn-secondary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
        LinkedIn
      </a>
      <a href="https://wa.me/${waNum}?text=${waMsg}" target="_blank" rel="noopener" class="btn-contact btn-secondary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.38 2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        ${waFmt}
      </a>
      ${cvBtn}
    </div>
  </div>
</section>`;
  }

  function buildFooter() {
    const year = new Date().getFullYear();
    return `
<footer>
  <p>© ${year} ${P.nombre} · Powered by Interactive Vitae</p>
  <a href="https://interactivevitae.com" target="_blank" rel="noopener">
    <img src="logo-footer.png" alt="Interactive Vitae" />
  </a>
</footer>`;
  }

  function buildOverlays() {
    return `
<div id="tour-overlay"></div>
<div id="tour-tooltip">
  <div class="tour-counter" id="tour-counter"></div>
  <div class="tour-title"  id="tour-title"></div>
  <div class="tour-desc"   id="tour-desc"></div>
  <div class="tour-actions">
    <button class="btn-tour-exit" id="tour-exit-btn">Salir del tour</button>
    <button class="btn-tour-next" id="tour-next-btn">Siguiente →</button>
  </div>
</div>
<div id="chat-panel-overlay"></div>
<button id="chat-bubble" aria-label="Abrir chat">💬</button>
<div id="chat-panel">
  <div class="chat-panel-header">
    <div class="chat-panel-avatar">${P.initials}</div>
    <div class="chat-panel-info">
      <div class="chat-panel-name">${P.nombre.split(' ')[0]} AI</div>
      <div class="chat-panel-status"><span class="chat-panel-status-dot"></span> Online</div>
    </div>
    <div class="chat-panel-ai-chip">✦ AI</div>
    <div class="chat-panel-controls">
      <button class="chat-panel-btn" id="chat-panel-expand" aria-label="Expandir">⛶</button>
      <button class="chat-panel-btn" id="chat-panel-close"  aria-label="Cerrar">✕</button>
    </div>
  </div>
  <div class="chat-panel-messages" id="chat-panel-messages"></div>
  <div class="chat-panel-input-area">
    <input type="text" class="chat-panel-input" id="chat-panel-input" placeholder="Escribí tu pregunta..." />
    <button class="chat-panel-send" id="chat-panel-send-btn" aria-label="Enviar">${SEND_ICON}</button>
  </div>
</div>`;
  }

  function buildChatPageSection(lang) {
    const l   = lang === 'es';
    const faq = l ? BOT.faq_es : BOT.faq_en;
    const faqChips = faq.map((f, i) =>
      `<button class="chat-suggest-chip" data-question="${encodeURIComponent(f.pregunta)}" data-faq-index="${i}">${f.pregunta}</button>`
    ).join('');

    const waNum = C.whatsapp.replace(/\D/g, '');
    const waMsg = encodeURIComponent(l ? C.whatsapp_msg_es : C.whatsapp_msg_en);
    const waFmt = `+${waNum.slice(0,2)} ${waNum.slice(2,4)} ${waNum.slice(4,8)}-${waNum.slice(8)}`;

    return `
<section id="chat-page">
  <div class="chat-page-wrapper">
  <a href="index.html" class="chat-page-back">← ${l ? 'Volver al perfil' : 'Back to profile'}</a>
  <div class="chat-page-container">
    <div class="chat-page-top">
      <div class="chat-page-left">
        <p class="chat-page-label">✦ AI-POWERED</p>
        <h2 class="chat-page-title">${l ? 'Conoceme a través de mi Asistente IA' : 'Get to know me through my AI Assistant'}</h2>
        <p class="chat-page-subtitle">${l
          ? 'Preguntale lo que necesites saber sobre mí. Te va a ayudar a evaluar si mi perfil es lo que estás buscando.'
          : 'Ask it anything you need to know about me. It will help you evaluate if my profile is the right fit.'}</p>
        <p class="chat-page-faq-label">${l ? 'PREGUNTAS FRECUENTES' : 'TRY ASKING'}</p>
        <div id="chat-faq-suggestions" class="chat-page-faq-chips">${faqChips}</div>
        <button id="chat-faq-more-btn" class="chat-faq-more-btn" style="display:none">${l ? 'Ver más preguntas ↓' : 'Show more questions ↓'}</button>
      </div>
      <div class="chat-page-right">
        <div class="chat-page-chat-header">
          <div class="chat-panel-avatar">${P.initials}</div>
          <div class="chat-panel-info">
            <div class="chat-panel-name">${P.nombre.split(' ')[0]} AI</div>
            <div class="chat-panel-status"><span class="chat-panel-status-dot"></span> Online</div>
          </div>
          <div class="chat-panel-ai-chip">✦ AI</div>
        </div>
        <div class="chat-panel-messages" id="chat-panel-messages"></div>
        <div class="chat-panel-input-area">
          <input type="text" class="chat-panel-input" id="chat-panel-input"
                 placeholder="${l ? 'Contame sobre tu empresa o desafío...' : 'Describe your company or challenge...'}" />
          <button class="chat-panel-send" id="chat-panel-send-btn" aria-label="Enviar">${SEND_ICON}</button>
        </div>
      </div>
    </div>
  </div>
  <div class="chat-page-contact">
    <a href="mailto:${C.email}" class="chat-contact-item">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
      ${C.email}
    </a>
    <a href="${C.linkedin}" target="_blank" rel="noopener" class="chat-contact-item">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
      LinkedIn
    </a>
    <a href="https://wa.me/${waNum}?text=${waMsg}" target="_blank" rel="noopener" class="chat-contact-item">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.38 2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      ${waFmt}
    </a>
  </div>
  </div>
</section>`;
  }

  function buildProjectsPageSection(lang) {
    const l   = lang === 'es';
    const PRJ = D.proyectos;
    const cards = PRJ.map(p => {
      const tag  = l ? p.tag_es  : p.tag_en;
      const desc = l ? p.desc_es : p.desc_en;
      return `
    <div class="prj-card fade-in">
      <div class="prj-card-image">
        <img src="${p.logo}" alt="${p.nombre}" data-logo-light="${p.logo}" data-logo-dark="${p.logo_dark || p.logo}" />
        <span class="prj-card-tag">${tag}</span>
      </div>
      <div class="prj-card-body">
        <h3 class="prj-card-name">${p.nombre}</h3>
        <p class="prj-card-desc">${desc}</p>
        <a href="${p.link}" target="_blank" rel="noopener" class="prj-card-btn">
          ${l ? 'Ver proyecto ↗' : 'View project ↗'}
        </a>
      </div>
    </div>`;
    }).join('');

    return `
<section id="projects-page">
  <div class="prj-page-wrapper">
    <a href="index.html" class="chat-page-back">← ${l ? 'Volver al perfil' : 'Back to profile'}</a>
    <div class="prj-page-header">
      <span class="prj-page-pill">${l ? 'PROYECTOS' : 'PROJECTS'}</span>
      <h1 class="prj-page-title">${l ? 'Mis Proyectos con IA' : 'My AI Projects'}</h1>
      <p class="prj-page-subtitle">${l ? 'Algunos productos que construí con Inteligencia Artificial' : 'Some products I built with Artificial Intelligence'}</p>
    </div>
    <div class="prj-grid">${cards}</div>
  </div>
</section>`;
  }

  function setupFaqSuggestions(sendFaqFn) {
    const container = document.getElementById('chat-faq-suggestions');
    if (!container) return;
    container.addEventListener('click', e => {
      const chip = e.target.closest('[data-question]');
      if (!chip) return;
      sendFaqFn(decodeURIComponent(chip.dataset.question));
    });
  }

  function setupFaqPagination(lang) {
    if (window.innerWidth > 768) return;
    const container = document.getElementById('chat-faq-suggestions');
    const moreBtn   = document.getElementById('chat-faq-more-btn');
    if (!container || !moreBtn) return;
    const l     = lang === 'es';
    const moreLbl = l ? 'Ver más preguntas ↓' : 'Show more questions ↓';
    const lessLbl = l ? 'Ver menos ↑'         : 'Show less ↑';
    const chips = Array.from(container.querySelectorAll('[data-faq-index]'));
    const total = chips.length;
    let visible = 3;
    function applyVisibility() {
      chips.forEach((chip, i) => { chip.style.display = i < visible ? '' : 'none'; });
      moreBtn.textContent = visible >= total ? lessLbl : moreLbl;
    }
    applyVisibility();
    moreBtn.style.display = 'block';
    moreBtn.addEventListener('click', () => {
      visible = visible >= total ? 3 : Math.min(visible + 3, total);
      applyVisibility();
    });
  }

  // ── Render ───────────────────────────────────────────────────────────────

  let currentLang = localStorage.getItem('iv-lang') || 'es';

  function renderPage(lang) {
    const isChatPage     = window.location.pathname.includes('chat');
    const isProjectsPage = window.location.pathname.includes('projects');

    if (isProjectsPage) {
      document.body.innerHTML =
        buildNav() +
        buildProjectsPageSection(lang) +
        buildFooter();
      applyTheme(localStorage.getItem('iv-theme') === 'dark');
      setupDarkModeBtn();
      setupLangBtn(lang);
      setupHamburger();
      setupScrollAnimations();
      setupScrollProgress();
      updateNavLabels(lang);
    } else if (isChatPage) {
      document.body.innerHTML =
        buildNav() +
        buildChatPageSection(lang) +
        buildFooter();
      applyTheme(localStorage.getItem('iv-theme') === 'dark');
      setupDarkModeBtn();
      setupLangBtn(lang);
      setupHamburger();
      setupChat(lang);
      setupFaqPagination(lang);
      setupScrollProgress();
      updateNavLabels(lang);
    } else {
      document.body.innerHTML =
        buildNav() +
        buildHero(lang) +
        buildExperience(lang) +
        buildSkills(lang) +
        buildAbout(lang) +
        buildContact(lang) +
        buildFooter() +
        buildOverlays();
      applyTheme(localStorage.getItem('iv-theme') === 'dark');
      setupDarkModeBtn();
      setupLangBtn(lang);
      setupTour(lang);
      setupHamburger();
      setupScrollAnimations();
      setupScrollProgress();
      setupChat(lang);
      updateNavLabels(lang);
    }
  }

  // ── Nav labels ───────────────────────────────────────────────────────────

  const NAV_LABELS = {
    es: { exp: 'Experiencia', skills: 'Skills', formation: 'Mi Formación', about: 'Sobre mí', contact: 'Contacto', projects: 'Proyectos', agent: 'AI Agent' },
    en: { exp: 'Experience',  skills: 'Skills', formation: 'My Background', about: 'About Me',  contact: 'Contact',  projects: 'Projects',  agent: 'AI Agent' },
  };

  function updateNavLabels(lang) {
    const lb = NAV_LABELS[lang];
    [['nav-exp', lb.exp], ['nav-skills', lb.skills], ['nav-formation', lb.formation],
     ['nav-about', lb.about], ['nav-contact', lb.contact], ['nav-projects', lb.projects], ['nav-agent', lb.agent],
     ['mnav-exp', lb.exp], ['mnav-skills', lb.skills], ['mnav-formation', lb.formation],
     ['mnav-about', lb.about], ['mnav-contact', lb.contact], ['mnav-projects', lb.projects], ['mnav-agent', lb.agent]
    ].forEach(([id, text]) => { const el = document.getElementById(id); if (el) el.textContent = text; });
  }

  // ── Language toggle ──────────────────────────────────────────────────────

  function setupLangBtn(lang) {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;
    btn.textContent = lang === 'es' ? 'EN' : 'ES';
    btn.addEventListener('click', () => {
      currentLang = currentLang === 'es' ? 'en' : 'es';
      localStorage.setItem('iv-lang', currentLang);
      renderPage(currentLang);
    });
  }

  // ── Dark mode ────────────────────────────────────────────────────────────

  function applyTheme(dark) {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      const btn  = document.getElementById('theme-toggle');
      const logo = document.getElementById('nav-logo');
      if (btn)  btn.textContent = '☀️';
      if (logo) logo.src = 'logo-footer.png';
    } else {
      document.documentElement.removeAttribute('data-theme');
      const btn  = document.getElementById('theme-toggle');
      const logo = document.getElementById('nav-logo');
      if (btn)  btn.textContent = '🌙';
      if (logo) logo.src = 'logo.png';
    }
    updateProjectLogos(dark);
  }

  function updateProjectLogos(dark) {
    document.querySelectorAll('[data-logo-light][data-logo-dark]').forEach(img => {
      img.src = dark ? img.dataset.logoDark : img.dataset.logoLight;
    });
  }

  function setupDarkModeBtn() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      localStorage.setItem('iv-theme', isDark ? 'light' : 'dark');
      applyTheme(!isDark);
    });
  }

  // ── Tour ─────────────────────────────────────────────────────────────────

  function setupTour(lang) {
    const steps    = lang === 'es' ? D.tour.pasos_es : D.tour.pasos_en;
    const exitLbl  = lang === 'es' ? 'Salir del tour' : 'Exit tour';
    const nextLbl  = lang === 'es' ? 'Siguiente →'   : 'Next →';
    const finLbl   = lang === 'es' ? 'Finalizar ✓'   : 'Finish ✓';
    const ofLbl    = lang === 'es' ? 'DE' : 'OF';
    const sections = ['#hero', '#experience', '#skills', '#sobre-mi', '#contact'];

    const overlay   = document.getElementById('tour-overlay');
    const tooltip   = document.getElementById('tour-tooltip');
    const counter   = document.getElementById('tour-counter');
    const titleEl   = document.getElementById('tour-title');
    const descEl    = document.getElementById('tour-desc');
    const exitBtn   = document.getElementById('tour-exit-btn');
    const nextBtn   = document.getElementById('tour-next-btn');
    const tourTrigger = document.getElementById('tour-btn');

    let step = 0;

    function show() {
      const s = steps[step];
      counter.textContent = `${step + 1} ${ofLbl} ${steps.length}`;
      titleEl.textContent = s.titulo;
      descEl.textContent  = s.descripcion;
      nextBtn.textContent = step === steps.length - 1 ? finLbl : nextLbl;
      exitBtn.textContent = exitLbl;
      overlay.style.display = 'block';
      tooltip.style.display = 'block';
      document.querySelector(sections[step])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function exit() {
      overlay.style.display = 'none';
      tooltip.style.display = 'none';
    }

    const isSubPage = /\/(chat|projects)(\.html)?$/.test(window.location.pathname);
    console.log('[Tour] pathname:', window.location.pathname);
    console.log('[Tour] isSubPage:', isSubPage);
    console.log('[Tour] #tour-btn found:', !!tourTrigger);
    tourTrigger?.addEventListener('click', () => {
      if (isSubPage) { window.location.href = 'index.html?tour=1'; return; }
      step = 0; show();
    });
    exitBtn?.addEventListener('click', exit);
    overlay?.addEventListener('click', exit);
    nextBtn?.addEventListener('click', () => {
      if (step < steps.length - 1) { step++; show(); } else exit();
    });
  }

  // ── Hamburger ────────────────────────────────────────────────────────────

  function setupHamburger() {
    const btn  = document.getElementById('hamburger-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('.mobile-nav-link').forEach(a =>
      a.addEventListener('click', () => menu.classList.remove('open'))
    );
    document.addEventListener('click', e => {
      if (!btn.contains(e.target) && !menu.contains(e.target))
        menu.classList.remove('open');
    });
  }

  // ── Scroll animations ────────────────────────────────────────────────────

  function setupScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

  function setupScrollAnimations() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
  }

  // ── Chat ─────────────────────────────────────────────────────────────────

  function setupChat(lang) {
    const l       = lang === 'es';
    const faq     = l ? BOT.faq_es : BOT.faq_en;
    const strings = {
      welcome1:    l ? `¡Hola! Soy el asistente potenciado con IA de ${P.nombre}. Puedo ayudarte a evaluar si su perfil encaja con lo que estás buscando.`
                     : `Hi! I'm ${P.nombre}'s AI-powered assistant. I can help you evaluate if his profile matches what you're looking for.`,
      welcome2:    l ? 'Contame sobre el puesto que querés cubrir, tu empresa, o los desafíos que estás tratando de resolver.'
                     : "Tell me about the role you want to fill, your company, or the challenges you're trying to solve.",
      faqQuestion: l ? '¿Querés ver otra pregunta?' : 'Would you like to see another question?',
      moreFaqsYes: l ? 'Claro, estas son las preguntas frecuentes:' : 'Sure, here are the frequently asked questions:',
      moreFaqsNo:  l ? '¡Perfecto! Si tenés alguna otra consulta, escribime directamente.' : "Perfect! If you have any other questions, feel free to write to me directly.",
      errorMsg:    l ? `No pudimos conectar con el Asistente de ${P.nombre.split(' ')[0]}, pero podés ver lo que preguntan otras personas:`
                     : `We couldn't connect to ${P.nombre.split(' ')[0]}'s Assistant, but you can see what others ask:`,
      limitMsg:    l ? 'Alcanzaste el límite de preguntas de esta sesión. Pero podés explorar las preguntas frecuentes que dejaron otras personas 👇'
                     : "You've reached the session question limit. But you can explore the frequently asked questions below 👇",
      placeholder: l ? 'Escribí tu pregunta...' : 'Type your question...',
      yesBtn: l ? 'Sí' : 'Yes',
    };

    const bubbleEl   = document.getElementById('chat-bubble');
    const panelEl    = document.getElementById('chat-panel');
    const overlayEl  = document.getElementById('chat-panel-overlay');
    const messagesEl = document.getElementById('chat-panel-messages');
    const inputEl    = document.getElementById('chat-panel-input');
    const sendBtn    = document.getElementById('chat-panel-send-btn');

    const pageMode = !bubbleEl;

    inputEl.placeholder = strings.placeholder;

    const history          = [];
    let   welcomeShown     = false;
    let   userMessageCount = 0;
    const BOT_AVT       = `<div class="msg-avatar">🤖</div>`;
    const USER_AVT      = `<div class="msg-avatar">${P.initials}</div>`;

    function faqChipsHTML() {
      return `<div class="chat-faq-chips">${faq.map(f =>
        `<button class="chat-faq-chip" data-faq="${encodeURIComponent(f.pregunta)}">${f.pregunta}</button>`
      ).join('')}</div>`;
    }

    function moreChipsHTML() {
      return `<div class="chat-faq-chips">
        <button class="chat-faq-chip" data-more="yes">${strings.yesBtn}</button>
        <button class="chat-faq-chip" data-more="no">No</button>
      </div>`;
    }

    function addMsg(html, isUser) {
      const avt  = isUser ? `<div class="msg user">${USER_AVT}` : `<div class="msg">${BOT_AVT}`;
      messagesEl.innerHTML += `${avt}<div class="msg-bubble">${html}</div></div>`;
      messagesEl.scrollTop  = messagesEl.scrollHeight;
    }

    function addTyping() {
      const id = 'bt-' + Date.now();
      messagesEl.innerHTML += `<div class="msg" id="${id}">${BOT_AVT}<div class="msg-bubble"><div class="typing"><span></span><span></span><span></span></div></div></div>`;
      messagesEl.scrollTop  = messagesEl.scrollHeight;
      return id;
    }

    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

    async function showWelcome() {
      if (welcomeShown) return;
      welcomeShown = true;
      await delay(500);
      const t1 = addTyping();
      await delay(1000);
      document.getElementById(t1)?.remove();
      addMsg(strings.welcome1, false);
      await delay(400);
      const t2 = addTyping();
      await delay(900);
      document.getElementById(t2)?.remove();
      addMsg(strings.welcome2, false);
    }

    function delegateChips(e) {
      const chip = e.target.closest('[data-faq]');
      const more = e.target.closest('[data-more]');
      if (chip) sendFaq(decodeURIComponent(chip.dataset.faq));
      if (more) handleMore(more.dataset.more === 'yes');
    }

    messagesEl.addEventListener('click', delegateChips);

    async function sendFaq(question) {
      addMsg(question, true);
      const tid  = addTyping();
      await delay(1000);
      document.getElementById(tid)?.remove();
      const item = faq.find(f => f.pregunta === question);
      addMsg(item ? item.respuesta : '...', false);
      addMsg(strings.faqQuestion, false);
      messagesEl.innerHTML += moreChipsHTML();
      messagesEl.scrollTop  = messagesEl.scrollHeight;
    }

    function handleMore(yes) {
      if (yes) {
        addMsg(strings.moreFaqsYes, false);
        messagesEl.innerHTML += faqChipsHTML();
      } else {
        addMsg(strings.moreFaqsNo, false);
      }
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    async function sendMessage() {
      const msg = inputEl.value.trim();
      if (!msg) return;
      inputEl.value  = '';
      sendBtn.disabled = true;
      addMsg(msg, true);
      userMessageCount++;
      history.push({ role: 'user', content: msg });
      const tid = addTyping();
      try {
        const res   = await fetch('/.netlify/functions/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        });
        const data  = await res.json();
        const reply = data.content?.[0]?.text || (l ? 'Hubo un error. Por favor intentá de nuevo.' : 'An error occurred. Please try again.');
        history.push({ role: 'assistant', content: reply });
        document.getElementById(tid)?.remove();
        addMsg(reply.replace(/\n/g, '<br/>'), false);
      } catch {
        await delay(800);
        document.getElementById(tid)?.remove();
        addMsg(strings.errorMsg, false);
        messagesEl.innerHTML += faqChipsHTML();
        messagesEl.scrollTop  = messagesEl.scrollHeight;
      }
      if (userMessageCount >= 10) {
        inputEl.disabled   = true;
        sendBtn.disabled   = true;
        inputEl.placeholder = '';
        addMsg(strings.limitMsg, false);
        messagesEl.innerHTML += faqChipsHTML();
        messagesEl.scrollTop  = messagesEl.scrollHeight;
      } else {
        sendBtn.disabled = false;
      }
    }

    if (!pageMode) {
      bubbleEl.addEventListener('click', () => {
        panelEl.classList.add('open');
        bubbleEl.style.display = 'none';
        showWelcome();
        inputEl.focus();
      });

      document.getElementById('chat-panel-close')?.addEventListener('click', () => {
        panelEl.classList.remove('open', 'expanded');
        overlayEl.classList.remove('open');
        bubbleEl.style.display = 'flex';
      });

      document.getElementById('chat-panel-expand')?.addEventListener('click', () => {
        const expanded = panelEl.classList.toggle('expanded');
        overlayEl.classList.toggle('open', expanded);
      });

      overlayEl?.addEventListener('click', () => {
        panelEl.classList.remove('expanded');
        overlayEl.classList.remove('open');
      });
    } else {
      showWelcome();
      inputEl?.focus();
      setupFaqSuggestions(sendFaq);
    }

    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
  }

  // ── Boot ─────────────────────────────────────────────────────────────────
  renderPage(currentLang);

  const tourParam = new URLSearchParams(window.location.search).get('tour');
  console.log('[Boot] ?tour param:', tourParam);
  console.log('[Boot] #tour-btn found:', !!document.getElementById('tour-btn'));
  if (tourParam === '1') {
    document.getElementById('tour-btn')?.click();
    history.replaceState(null, '', window.location.pathname);
  }

})();
