const controls = document.querySelector('.demo-controls');
const buttons = Array.from(controls.querySelectorAll('button'));
const panels = buttons.map(button => document.getElementById(button.getAttribute('aria-controls')));

function selectPanel(selected) {
  buttons.forEach((button, index) => {
    const active = button === selected;
    const panel = panels[index];
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    panel.hidden = !active;
    if (!active) panel.querySelector('video')?.pause();
  });
}

controls.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (button) selectPanel(button);
});

controls.addEventListener('keydown', event => {
  const index = buttons.indexOf(event.target);
  if (index < 0) return;
  let next;
  switch (event.key) {
    case 'ArrowRight': next = (index + 1) % buttons.length; break;
    case 'ArrowLeft': next = (index + buttons.length - 1) % buttons.length; break;
    case 'Home': next = 0; break;
    case 'End': next = buttons.length - 1; break;
    default: return;
  }
  event.preventDefault();
  selectPanel(buttons[next]);
  buttons[next].focus();
});

panels.forEach((panel, index) => {
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', buttons[index].id);
  panel.tabIndex = 0;
});
function panelFromHash() {
  const index = panels.findIndex(panel => '#' + panel.id === location.hash);
  return buttons[index];
}
selectPanel(panelFromHash() || buttons.find(button => button.getAttribute('aria-selected') === 'true'));
controls.hidden = false;
window.addEventListener('hashchange', () => {
  const button = panelFromHash();
  if (button) {
    selectPanel(button);
    controls.scrollIntoView({ block: 'start' });
  }
});

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.getElementById('main-nav');

function setMenu(open) {
  mainNav.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}

menuToggle.hidden = false;
document.documentElement.classList.add('menu-ready');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  setMenu(open);
  if (open) mainNav.querySelector('a').focus();
});
mainNav.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});

const filmLaunch = document.getElementById('hero-film');
const filmDialog = document.querySelector('.film-dialog');
const film = filmDialog.querySelector('video');
if (typeof filmDialog.showModal === 'function') {
  filmLaunch.setAttribute('aria-haspopup', 'dialog');
  filmLaunch.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    panels.forEach(panel => panel.querySelector('video')?.pause());
    filmDialog.showModal();
    film.currentTime = 0;
    film.play().catch(() => { /* Native controls allow playback when a browser requires another tap. */ });
  });
  filmDialog.addEventListener('close', () => {
    film.pause();
    filmLaunch.focus({ preventScroll: true });
  });
  filmDialog.addEventListener('click', event => {
    if (event.target !== filmDialog) return;
    const bounds = filmDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      filmDialog.close();
    }
  });
} else {
  filmLaunch.addEventListener('click', () => selectPanel(buttons.find(button => button.getAttribute('aria-controls') === 'demo-motion')));
}
