(() => {
  const sequence = document.querySelector('.feature-sequence');
  if (!sequence) return;

  const chapters = Array.from(sequence.querySelectorAll('.feature-chapter'));
  const copy = chapters.map(chapter => chapter.querySelector('.chapter-copy'));
  const visuals = chapters.map(chapter => chapter.querySelector('.chapter-visual'));
  const motion = matchMedia('(min-height: 560px) and (prefers-reduced-motion: no-preference)');
  const stage = document.createElement('div');
  stage.className = 'chapter-stage';
  stage.setAttribute('aria-hidden', 'true');

  let frame;
  let active = -1;

  function updateChapter() {
    frame = undefined;
    const focusLine = window.innerHeight * (window.innerWidth <= 700 ? .75 : .57);
    let next = 0;
    copy.forEach((text, index) => {
      if (text.getBoundingClientRect().top <= focusLine) next = index;
    });
    if (next === active) return;

    visuals[active]?.classList.remove('is-current');
    visuals[next].classList.add('is-current');
    active = next;
  }

  function requestUpdate() {
    if (frame === undefined) frame = requestAnimationFrame(updateChapter);
  }

  function updateLayout() {
    if (motion.matches) {
      stage.append(...visuals);
      sequence.prepend(stage);
      sequence.dataset.scrollStory = '';
      updateChapter();
      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', requestUpdate);
    } else if (stage.isConnected) {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      delete sequence.dataset.scrollStory;
      visuals.forEach((visual, index) => chapters[index].append(visual));
      visuals[active]?.classList.remove('is-current');
      stage.remove();
      active = -1;
    }
  }

  updateLayout();
  motion.addEventListener('change', updateLayout);
})();
