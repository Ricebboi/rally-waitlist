const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(returnFocus = false) {
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');
  if (returnFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});
matchMedia('(min-width: 621px)').addEventListener('change', () => closeMenu());

const story = document.querySelector('.swing-story');
const stepGroup = story.querySelector('.swing-steps');
const steps = Array.from(stepGroup.querySelectorAll('.swing-step'));
const media = story.querySelector('.swing-media');
const scenes = steps.map(step => document.getElementById(step.getAttribute('aria-controls')));
const scrollStory = matchMedia('(min-width: 900px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)');
let activeStep;

function showSwingStep(selectedStep) {
  if (activeStep === selectedStep) return;
  activeStep = selectedStep;
  steps.forEach((step, index) => {
    const active = step === activeStep;
    step.setAttribute('aria-pressed', String(active));
    const scene = scenes[index];
    if (!active) scene.querySelector('video')?.pause();
    scene.hidden = !active;
  });
}

showSwingStep(steps[0]);
steps.forEach(step => step.addEventListener('click', () => showSwingStep(step)));
story.dataset.ready = '';
stepGroup.hidden = false;

if ('IntersectionObserver' in window) {
  const stepObserver = new IntersectionObserver(entries => {
    if (!scrollStory.matches || media.contains(document.activeElement)) return;
    const entered = entries.find(entry => entry.isIntersecting);
    if (entered) showSwingStep(entered.target);
  }, { rootMargin: '-46% 0px -46% 0px' });

  function updateScrollStory() {
    stepObserver.disconnect();
    if (scrollStory.matches) steps.forEach(step => stepObserver.observe(step));
  }

  updateScrollStory();
  scrollStory.addEventListener('change', updateScrollStory);
}
