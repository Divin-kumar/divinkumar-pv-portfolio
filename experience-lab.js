
/* Portfolio Experience / 2026. No external APIs, analytics, or private data. */
(() => {
  'use strict';
  const root = document.documentElement;
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const safeStore = {
    get(key) { try { return localStorage.getItem(key); } catch (_) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
  };
  let feedbackTimer;
  function announce(message) {
    const box = $('#toast');
    if (!box) return;
    box.textContent = message;
    box.classList.add('show');
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => box.classList.remove('show'), 2800);
  }
  async function copyValue(value) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      announce('Clipboard unavailable. Please copy manually.');
      return;
    }
    try { await navigator.clipboard.writeText(value); announce('Copied to clipboard'); }
    catch (_) { announce('Clipboard permission unavailable.'); }
  }
  // Motion is a preference, not a prerequisite for reading the content.
  const motionButton = $('#motionToggle');
  const initialMotion = safeStore.get('pv-portfolio-motion');
  const systemReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let motionOff = initialMotion === 'off' || (initialMotion !== 'on' && systemReduced);
  function setMotion(off) {
    motionOff = off;
    root.dataset.motion = off ? 'off' : 'on';
    if (motionButton) {
      motionButton.setAttribute('aria-pressed', String(off));
      motionButton.setAttribute('aria-label', off ? 'Enable animations' : 'Reduce animations');
      motionButton.title = off ? 'Enable animations' : 'Reduce animations';
    }
  }
  setMotion(motionOff);
  if (motionButton) motionButton.addEventListener('click', () => {
    setMotion(!motionOff);
    safeStore.set('pv-portfolio-motion', motionOff ? 'off' : 'on');
    announce(motionOff ? 'Reduced motion enabled' : 'Animations enabled');
  });
  // One-click shareable introduction, intentionally without client details.
  $('#copyIntro')?.addEventListener('click', () => copyValue(
    'Divinkumar Sundaramoorthi | Techno-functional Pharmacovigilance Systems Analyst. ' +
    'Experienced in regulated PV application support, incident and service request management, ' +
    'user access and workflow operations, reconciliation support, SQL investigation, validation and change coordination.'
  ));
  // Accessible, searchable keyboard-first section navigation.
  const palette = $('#commandPalette');
  const search = $('#commandSearch');
  const launch = $('#quickOpen');
  const commands = $$('.cmd-item[data-command-target]');
  function openPalette() {
    if (!palette) return;
    if (palette.showModal) { if (!palette.open) palette.showModal(); }
    else palette.setAttribute('open', '');
    if (search) {
      search.value = '';
      filterCommands('');
      search.focus();
    }
  }
  function closePalette() {
    if (!palette) return;
    if (palette.close && palette.open) palette.close();
    else palette.removeAttribute('open');
  }
  function filterCommands(term) {
    const query = term.trim().toLowerCase();
    let visible = 0;
    commands.forEach(button => {
      const show = button.textContent.toLowerCase().includes(query);
      button.hidden = !show;
      if (show) visible++;
    });
    const empty = $('#commandEmpty');
    if (empty) empty.hidden = visible !== 0;
  }
  function jumpTo(target) {
    const anchor = document.querySelector(target);
    if (!anchor) return;
    closePalette();
    anchor.scrollIntoView({behavior: motionOff ? 'auto' : 'smooth', block:'start'});
    if (window.history && window.history.replaceState) window.history.replaceState(null, '', target);
  }
  launch?.addEventListener('click', openPalette);
  $('#commandClose')?.addEventListener('click', closePalette);
  commands.forEach(button => button.addEventListener('click', () => jumpTo(button.dataset.commandTarget)));
  search?.addEventListener('input', () => filterCommands(search.value));
  search?.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      const first = commands.find(item => !item.hidden);
      if (first) { event.preventDefault(); jumpTo(first.dataset.commandTarget); }
    } else if (event.key === 'ArrowDown') {
      const first = commands.find(item => !item.hidden);
      if (first) { event.preventDefault(); first.focus(); }
    }
  });
  commands.forEach(button => button.addEventListener('keydown', event => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const visible = commands.filter(item => !item.hidden);
    const index = visible.indexOf(button);
    if (index < 0 || !visible.length) return;
    visible[(index + (event.key === 'ArrowDown' ? 1 : -1) + visible.length) % visible.length].focus();
  }));
  palette?.addEventListener('click', event => { if (event.target === palette) closePalette(); });
  document.addEventListener('keydown', event => {
    const editable = event.target instanceof HTMLElement &&
      (event.target.matches('input,textarea,select,[contenteditable="true"]'));
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault(); if (palette?.open) closePalette(); else openPalette();
    } else if (event.key === '/' && !editable && !(palette && palette.open)) {
      event.preventDefault(); openPalette();
    } else if (event.key === 'Escape' && palette && palette.open) {
      closePalette();
    }
  });
  // Reading progress and context-aware section navigation.
  const navLinks = $$('#navLinks a[href^="#"]');
  const sections = $$('main section[id]');
  const readingDock = $('#readingDock');
  const readingLabel = $('#readingLabel');
  let ticking = false;
  const names = {
    home:'Introduction',about:'About',experience:'Experience',
    expertise:'Expertise',toolkit:'Toolkit',work:'Workstreams',
    lab:'Workflow lab',education:'Education',contact:'Contact'
  };
  function updateReading() {
    ticking = false;
    const position = window.scrollY + window.innerHeight * .36;
    let active = sections[0];
    sections.forEach(section => { if (section.offsetTop <= position) active = section; });
    if (!active) return;
    navLinks.forEach(link => {
      if (link.getAttribute('href') === '#' + active.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (readingLabel) readingLabel.textContent = names[active.id] || 'Portfolio';
    const dockVisible = window.scrollY > 520;
    readingDock?.classList.toggle('is-visible', dockVisible);
    readingDock?.setAttribute('aria-hidden', String(!dockVisible));
    $('#backToTop')?.setAttribute('tabindex', dockVisible ? '0' : '-1');
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateReading); }
  }, {passive:true});
  window.addEventListener('resize', updateReading, {passive:true});
  updateReading();
  $('#backToTop')?.addEventListener('click', () => jumpTo('#home'));
  // Expandable workstream details are high-level illustrations, not case studies.
  const workInsights = [
    'Monitor transmission outcomes, examine acknowledgements, coordinate investigation and document verified conclusions.',
    'Clarify the request, assess the relevant operational workflow, align with stakeholders and verify the final record state.',
    'Review impact, prepare traceable test scenarios, check evidence and support verification of controlled releases.',
    'Validate the request and required approvals, coordinate fulfilment and retain clear access-review evidence.',
    'Review maintenance dependencies, coordinate test or release windows and verify operational readiness after changes.',
    'Assess symptoms and data context, use approved read-only checks and document evidence-backed next steps.'
  ];
  $$('.work-card').forEach((card, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'work-more';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'workDetail' + i);
    button.innerHTML = 'Explore approach <span class="mark" aria-hidden="true">+</span>';
    const detail = document.createElement('div');
    detail.className = 'work-detail';
    detail.id = 'workDetail' + i;
    detail.hidden = true;
    detail.textContent = workInsights[i] || 'Review the workflow, document evidence and coordinate the next action.';
    card.append(button, detail);
    button.addEventListener('click', () => {
      const opening = detail.hidden;
      detail.hidden = !opening;
      button.setAttribute('aria-expanded', String(opening));
    });
  });
  // Workflow explorer is intentionally illustrative and read-only.
  const workflows = {
    incident: {
      label:'Incident investigation',
      outcome:'Outcome: evidence-backed investigation notes and a clear next action, reviewed by the support analyst.',
      steps:[
        ['Understand the signal','Gather the reported symptom, business impact and known context without assuming a root cause.'],
        ['Triage and prioritize','Check scope, urgency and dependencies against the established incident management process.'],
        ['Investigate safely','Use approved diagnostics and previous knowledge to validate or reject possible causes.'],
        ['Verify and document','Confirm the result, document supporting evidence and communicate the next step or resolution.']
      ]
    },
    access: {
      label:'User access & roles',
      outcome:'Outcome: a traceable, approval-aligned access request with no unauthorized permission changes.',
      steps:[
        ['Capture the request','Identify the requested application, access purpose and relevant role or environment.'],
        ['Check completeness','Review whether requester information, justification and approvals are present.'],
        ['Coordinate fulfilment','Follow the authorized access-management workflow and maintain clear task updates.'],
        ['Confirm and retain evidence','Verify the approved outcome and record completion or clarification needs.']
      ]
    },
    reconciliation: {
      label:'Reconciliation support',
      outcome:'Outcome: reviewed reconciliation actions, traceable discrepancies and clearly assigned follow-ups.',
      steps:[
        ['Establish the scope','Confirm the approved request, relevant reporting period and expected record or schedule state.'],
        ['Review inputs','Check the completeness and consistency of permitted source information.'],
        ['Investigate discrepancies','Flag exceptions for review and compare them against established business rules.'],
        ['Document disposition','Capture confirmed findings, owners and any pending clarification or follow-up.']
      ]
    },
    change: {
      label:'Testing & change',
      outcome:'Outcome: traceable, review-ready evidence supporting controlled change delivery.',
      steps:[
        ['Understand change impact','Identify affected workflows and the expected change outcome.'],
        ['Prepare test coverage','Document normal, negative and boundary scenarios under approved test procedures.'],
        ['Execute and review','Capture test outcomes and review defects or deviations with the relevant teams.'],
        ['Verify and hand over','Confirm approved evidence and support post-change checks and documentation.']
      ]
    }
  };
  const labTabs = $$('.lab-tab[data-lab-tab]');
  const labSteps = $('#labSteps');
  const labTitle = $('#labTitle');
  const labDescription = $('#labDescription');
  const labPhase = $('#labPhase');
  const labOutcome = $('#labOutcome');
  const labStory = $('#labStory');
  let currentWorkflow = 'incident';
  let currentStep = 0;
  function showStep(index) {
    const workflow = workflows[currentWorkflow];
    currentStep = Math.max(0, Math.min(index, workflow.steps.length - 1));
    labPhase.textContent = String(currentStep + 1).padStart(2,'0') + ' / ' + String(workflow.steps.length).padStart(2,'0') + ' · ' + workflow.label;
    labTitle.textContent = workflow.steps[currentStep][0];
    labDescription.textContent = workflow.steps[currentStep][1];
    labOutcome.textContent = workflow.outcome;
    $$('.lab-step',labSteps).forEach((button,i)=>{
      if (i===currentStep) button.setAttribute('aria-current','step');
      else button.removeAttribute('aria-current');
    });
    if (!motionOff) {
      labStory.classList.remove('is-transitioning');
      void labStory.offsetWidth;
      labStory.classList.add('is-transitioning');
    }
  }
  function showWorkflow(id) {
    if (!workflows[id] || !labSteps) return;
    currentWorkflow = id;
    labTabs.forEach(tab => {
      const chosen = tab.dataset.labTab === id;
      tab.setAttribute('aria-selected',String(chosen));
      tab.tabIndex = chosen ? 0 : -1;
      if (chosen) $('#labMainPanel')?.setAttribute('aria-labelledby', tab.id);
    });
    labSteps.replaceChildren();
    workflows[id].steps.forEach((entry,i) => {
      const button = document.createElement('button');
      button.className='lab-step';
      button.type='button';
      const number=document.createElement('span');
      number.className='lab-step-index';
      number.textContent=String(i+1).padStart(2,'0');
      const label=document.createElement('span');
      label.textContent=entry[0];
      button.append(number,label);
      button.addEventListener('click',()=>showStep(i));
      labSteps.append(button);
    });
    showStep(0);
  }
  if (labSteps && labTitle && labDescription && labPhase && labOutcome && labStory) {
    labTabs.forEach((tab,i) => {
      tab.addEventListener('click', () => showWorkflow(tab.dataset.labTab));
      tab.addEventListener('keydown', event => {
        const direction = event.key==='ArrowRight' ? 1 : event.key==='ArrowLeft' ? -1 : 0;
        if (!direction) return;
        event.preventDefault();
        const next=(i+direction+labTabs.length)%labTabs.length;
        labTabs[next].focus();
        showWorkflow(labTabs[next].dataset.labTab);
      });
    });
    showWorkflow(currentWorkflow);
    $('#copyWorkflow')?.addEventListener('click', () => {
      const workflow = workflows[currentWorkflow];
      const lines = [workflow.label, ...workflow.steps.map((entry,i) => (i+1)+'. '+entry[0]+': '+entry[1]), workflow.outcome,
        'Illustrative process summary; not a disclosure of client data or a claim of automated deployment.'];
      copyValue(lines.join('\n'));
    });
  }
})();
