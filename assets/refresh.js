(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!reduced.matches && 'IntersectionObserver' in window) document.documentElement.classList.add('js-motion');
  const nav = document.querySelector('#navLinks');
  const menu = document.querySelector('#menuToggle');
  const closeMenu = () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation menu');
  };
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); }
  }, true);
  matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);
  const links = [...nav.querySelectorAll('a')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  let pending = false;
  function updateNav() {
    let current = null;
    sections.forEach(section => { if (section.getBoundingClientRect().top <= 180) current = section.id; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 10) current = 'contact';
    links.forEach(link => {
      if (link.hash === '#' + current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    pending = false;
  }
  addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(updateNav); } }, {passive:true});
  updateNav();
  const dialog = document.querySelector('#workDialog');
  document.querySelectorAll('.work-card').forEach(card => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'work-detail-btn';
    button.innerHTML = 'Explore workstream <span aria-hidden="true">↗</span>';
    button.setAttribute('aria-label', 'Explore ' + card.querySelector('h3').textContent);
    button.addEventListener('click', () => {
      document.querySelector('#dialogTitle').textContent = card.querySelector('h3').textContent;
      document.querySelector('#dialogText').textContent = card.querySelector('p').textContent;
      const stack = document.querySelector('#dialogStack'); stack.replaceChildren();
      card.querySelector('.work-bottom span').textContent.split('·').forEach(text => {
        const pill = document.createElement('span'); pill.className = 'pill'; pill.textContent = text.trim(); stack.append(pill);
      });
      dialog.showModal();
    });
    card.append(button);
  });
  document.querySelector('#closeWorkDialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    }
  });
})();
