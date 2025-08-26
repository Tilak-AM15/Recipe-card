document.querySelectorAll('.recipe-card').forEach(function(card) {
  // Query elements via classes (scoped to each card)
  const btnIngredients   = card.querySelector('.toggle-ingredients');
  const btnSteps         = card.querySelector('.toggle-steps');
  const btnStart         = card.querySelector('.start-cooking');
  const btnNext          = card.querySelector('.next-step');
  const btnPrint         = card.querySelector('.print-btn');
  const ingredientsSec   = card.querySelector('.ingredients-section');
  const stepsSec         = card.querySelector('.steps-section');
  const stepsList        = card.querySelector('.steps-list');
  const progressBar      = card.querySelector('.progress-bar');
  const timerDisplay     = card.querySelector('.timer');
  const prepTimeElem     = card.querySelector('.prep-time');

  // Guard if markup incomplete
  if (!stepsList || !progressBar || !timerDisplay) return;

  let stepIdx   = -1;
  let countdown = null;
  const steps   = stepsList.children.length;

  // Parse prep time (minutes) -> default 30
  const prepTimeMinutes = (prepTimeElem && prepTimeElem.textContent.match(/\d+/))
    ? parseInt(prepTimeElem.textContent.match(/\d+/)[0], 10)
    : 30;

  // Collapsible toggles
  if (btnIngredients && ingredientsSec) {
    btnIngredients.addEventListener('click', () => {
      const open = ingredientsSec.classList.toggle('open');
      btnIngredients.textContent = open ? 'Hide Ingredients' : 'Show Ingredients';
    });
  }
  if (btnSteps && stepsSec) {
    btnSteps.addEventListener('click', () => {
      const open = stepsSec.classList.toggle('open');
      btnSteps.textContent = open ? 'Hide Steps' : 'Show Steps';
    });
  }

  // Start Cooking
  if (btnStart && btnNext && stepsSec) {
    btnStart.addEventListener('click', () => {
      stepsSec.classList.add('open');
      if (btnSteps) btnSteps.textContent = 'Hide Steps';

      stepIdx = 0;
      highlightStep(stepIdx);
      updateProgressBar();

      // Show Next button (remove any hidden state)
      btnNext.classList.remove('hide');
      btnNext.textContent = (steps === 1) ? 'Done' : 'Next';

      // Timer
      startTimer(prepTimeMinutes * 60);
    });
  }

  // Next / Done button — stays visible always
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (stepIdx < steps - 1) {
        stepIdx++;
        highlightStep(stepIdx);
        updateProgressBar();
        btnNext.textContent = (stepIdx === steps -1 ) ? 'Done' : 'Next';
      } else {
        // Already at last step; keep showing "Done"
          btnNext.textContent = 'Done';
          alert("You've completed all the steps . Your dish is ready!")
        // Optional: restart on extra click
        // stepIdx = 0; highlightStep(stepIdx); updateProgressBar(); btnNext.textContent = (steps === 1) ? 'Done' : 'Next';
      }
    });
  }

  // Print (page-wide print)
  if (btnPrint) {
    btnPrint.addEventListener('click', () => window.print());
  }

  // Desktop: open ingredients by default
//   if (window.innerWidth > 700 && ingredientsSec && btnIngredients) {
//     ingredientsSec.classList.add('open');
//     btnIngredients.textContent = 'Hide Ingredients';
//   }

  // Accessibility: Enter / Space toggle
  [btnIngredients, btnSteps].forEach(btn => {
    if (btn) btn.addEventListener('keyup', e => {
      if (e.key === 'Enter' || e.key === ' ') btn.click();
    });
  });

  // Helpers
  function highlightStep(idx){
    [...stepsList.children].forEach((li, i) => {
      li.classList.toggle('active', i === idx);
    });
    const active = stepsList.children[idx];
    active?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function updateProgressBar(){
    const percent = ((stepIdx + 1) / steps) * 100;
    progressBar.style.width = Math.max(0, Math.min(100, percent)) + '%';
  }

  function startTimer(seconds){
    stopTimer();
    let remaining = seconds;
    displayTime(remaining);
    timerDisplay.style.display = 'inline-flex';
    countdown = setInterval(() => {
      remaining--;
      displayTime(remaining);
      if (remaining <= 0) {
        stopTimer();
        timerDisplay.textContent = "Time's up!";
        pulse(timerDisplay);
      }
    }, 1000);
  }
  function stopTimer(){ if (countdown) clearInterval(countdown); }
  function displayTime(sec){
    const m = Math.floor(sec/60);
    const s = sec % 60;
    timerDisplay.textContent = `Timer: ${m}:${String(s).padStart(2,'0')}`;
  }
  function pulse(el){
    el.animate([
      { transform:'scale(1)',   opacity:1 },
      { transform:'scale(1.06)', opacity:1 },
      { transform:'scale(1)',   opacity:1 }
    ], { duration: 700, iterations: 1, easing: 'ease-out' });
  }
});
