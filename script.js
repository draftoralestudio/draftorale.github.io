/* =========================================================
   DRAFTORALE STUDIO — SCRIPT
   Multi-select client intake wizard
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     THEME
  ========================= */

  const themeToggle = document.getElementById("themeToggle");

  const savedTheme = localStorage.getItem("draftorale-theme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light");

      localStorage.setItem(
        "draftorale-theme",
        document.body.classList.contains("light") ? "light" : "dark"
      );
    });
  }


  /* =========================
     HEADER / SCROLL
  ========================= */

  const header = document.querySelector(".site-header");

  window.addEventListener("scroll", () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 30);
    }
  });


  /* =========================
     SCROLL PROGRESS
  ========================= */

  const progressBar = document.querySelector(".scroll-progress");

  window.addEventListener("scroll", () => {
    if (!progressBar) return;

    const scrollTop = window.scrollY;
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage =
      documentHeight > 0
        ? (scrollTop / documentHeight) * 100
        : 0;

    progressBar.style.width = `${percentage}%`;
  });


  /* =========================
     CURSOR GLOW
  ========================= */

  const cursorGlow = document.querySelector(".cursor-glow");

  if (cursorGlow && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("mousemove", (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    });
  }


  /* =========================
     SAMPLE TABS
  ========================= */

  const sampleTabs = document.querySelectorAll(".sample-tab");
  const samplePanels = document.querySelectorAll(".sample-panel");

  sampleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.sample;

      sampleTabs.forEach((item) => {
        item.classList.remove("active");
      });

      samplePanels.forEach((panel) => {
        panel.classList.remove("active");
      });

      tab.classList.add("active");

      const panel = document.querySelector(
        `.sample-panel[data-sample="${target}"]`
      );

      if (panel) {
        panel.classList.add("active");
      }
    });
  });


  /* =========================================================
     START THE STORY — CLIENT INTAKE WIZARD
     ========================================================= */

  const wizard = document.getElementById("storyWizard");
  const wizardBackdrop = document.querySelector(".wizard-backdrop");
  const wizardClose = document.querySelector(".wizard-close");

  const startButton = document.getElementById("startButton");
  const headerStart = document.querySelector(".header-start");

  const wizardScreens = document.querySelectorAll(".wizard-screen");
  const wizardStep = document.getElementById("wizardStep");
  const wizardProgress = document.getElementById("wizardProgress");
  const wizardBack = document.getElementById("wizardBack");

  const resultType = document.getElementById("resultType");
  const resultLanguage = document.getElementById("resultLanguage");
  const resultGenre = document.getElementById("resultGenre");
  const resultHave = document.getElementById("resultHave");
  const resultNeed = document.getElementById("resultNeed");

  const resultSummary = document.getElementById("resultSummary");
  const estimate = document.getElementById("estimate");

  const emailButton = document.getElementById("emailButton");
  const restartButton = document.getElementById("restartWizard");

  const STUDIO_EMAIL = "YOUR_STUDIO_EMAIL_HERE";

  let currentStep = 1;

  /*
    Multi-select:
      Step 1 = Project type
      Step 2 = Language (SINGLE)
      Step 3 = Genre
      Step 4 = What you have
      Step 5 = What you need
  */

  let answers = {
    type: [],
    language: "",
    genre: [],
    have: [],
    need: []
  };


  /* =========================
     OPEN / CLOSE
  ========================= */

  function openWizard() {
    if (!wizard) return;

    wizard.classList.add("open");
    document.body.classList.add("wizard-open");

    resetWizard();

    setTimeout(() => {
      const firstChoice = wizard.querySelector(
        '.wizard-screen[data-step="1"] .choice-grid button, .wizard-screen[data-step="1"] .choice-stack button'
      );

      if (firstChoice) {
        firstChoice.focus();
      }
    }, 250);
  }


  function closeWizard() {
    if (!wizard) return;

    wizard.classList.remove("open");
    document.body.classList.remove("wizard-open");
  }


  if (startButton) {
    startButton.addEventListener("click", (event) => {
      event.preventDefault();
      openWizard();
    });
  }


  if (headerStart) {
    headerStart.addEventListener("click", (event) => {
      event.preventDefault();
      openWizard();
    });
  }


  if (wizardClose) {
    wizardClose.addEventListener("click", closeWizard);
  }


  if (wizardBackdrop) {
    wizardBackdrop.addEventListener("click", closeWizard);
  }


  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && wizard?.classList.contains("open")) {
      closeWizard();
    }
  });


  /* =========================
     RESET
  ========================= */

  function resetWizard() {
    currentStep = 1;

    answers = {
      type: [],
      language: "",
      genre: [],
      have: [],
      need: []
    };

    document.querySelectorAll(".wizard-choice").forEach((button) => {
      button.classList.remove("selected");
      button.setAttribute("aria-pressed", "false");
    });

    document.querySelectorAll(".wizard-continue").forEach((button) => {
      button.disabled = false;
    });

    if (emailButton) {
      emailButton.classList.remove("email-opened");
      emailButton.textContent = "EMAIL THE BRIEF ↗";
    }

    showStep(1);
  }


  /* =========================
     STEP NAVIGATION
  ========================= */

  function showStep(step) {
    currentStep = step;

    wizardScreens.forEach((screen) => {
      const screenStep = Number(screen.dataset.step);

      screen.classList.toggle(
        "active",
        screenStep === step
      );
    });

    if (wizardStep) {
      wizardStep.textContent =
        step <= 5
          ? `${String(step).padStart(2, "0")} — 05`
          : "BRIEF";
    }

    if (wizardProgress) {
      const percentage =
        step <= 5
          ? (step / 5) * 100
          : 100;

      wizardProgress.style.width = `${percentage}%`;
    }

    if (wizardBack) {
      wizardBack.style.visibility =
        step > 1 && step <= 5
          ? "visible"
          : "hidden";
    }

    const panel = document.querySelector(".wizard-panel");

    if (panel) {
      panel.scrollTop = 0;
    }
  }


  if (wizardBack) {
    wizardBack.addEventListener("click", () => {
      if (currentStep > 1) {
        showStep(currentStep - 1);
      }
    });
  }


  /* =========================================================
     MULTI-SELECT CHOICE SYSTEM
     ========================================================= */

  const choiceButtons = document.querySelectorAll(".wizard-choice");

  choiceButtons.forEach((button) => {

    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {

      const step = Number(
        button.closest(".wizard-screen")?.dataset.step
      );

      const value =
        button.dataset.value ||
        button.textContent.trim();

      /*
        LANGUAGE = SINGLE SELECT
      */

      if (step === 2) {

        document
          .querySelectorAll(
            '.wizard-screen[data-step="2"] .wizard-choice'
          )
          .forEach((item) => {
            item.classList.remove("selected");
            item.setAttribute("aria-pressed", "false");
          });

        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");

        answers.language = value;

        updateContinueButton(step);

        return;
      }


      /*
        EVERYTHING ELSE = MULTI SELECT
      */

      const keyMap = {
        1: "type",
        3: "genre",
        4: "have",
        5: "need"
      };

      const key = keyMap[step];

      if (!key) return;

      /*
        "Other" / "Custom" don't force exclusivity.
        Every option can coexist with another option.
      */

      const index = answers[key].indexOf(value);

      if (index === -1) {

        answers[key].push(value);

        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");

      } else {

        answers[key].splice(index, 1);

        button.classList.remove("selected");
        button.setAttribute("aria-pressed", "false");
      }

      updateContinueButton(step);
    });
  });


  /* =========================
     CONTINUE BUTTONS
  ========================= */

  const continueButtons =
    document.querySelectorAll(".wizard-continue");

  continueButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const step = Number(
        button.closest(".wizard-screen")?.dataset.step
      );

      if (!step) return;

      if (!isStepComplete(step)) {
        showValidationMessage(step);
        return;
      }

      button.disabled = true;

      setTimeout(() => {
        button.disabled = false;

        if (step < 5) {
          showStep(step + 1);
        } else {
          showResult();
        }

      }, 180);
    });
  });


  function isStepComplete(step) {

    if (step === 1) {
      return answers.type.length > 0;
    }

    if (step === 2) {
      return answers.language !== "";
    }

    if (step === 3) {
      return answers.genre.length > 0;
    }

    if (step === 4) {
      return answers.have.length > 0;
    }

    if (step === 5) {
      return answers.need.length > 0;
    }

    return false;
  }


  function updateContinueButton(step) {

    const screen = document.querySelector(
      `.wizard-screen[data-step="${step}"]`
    );

    if (!screen) return;

    const button = screen.querySelector(".wizard-continue");

    if (!button) return;

    const complete = isStepComplete(step);

    button.disabled = !complete;

    button.classList.toggle(
      "ready",
      complete
    );
  }


  function showValidationMessage(step) {

    const screen = document.querySelector(
      `.wizard-screen[data-step="${step}"]`
    );

    if (!screen) return;

    const existing =
      screen.querySelector(".wizard-validation");

    if (existing) {
      existing.remove();
    }

    const message = document.createElement("div");

    message.className = "wizard-validation";
    message.textContent =
      step === 2
        ? "Choose a language to continue."
        : "Choose at least one option to continue.";

    const button =
      screen.querySelector(".wizard-continue");

    if (button) {
      button.before(message);
    }

    setTimeout(() => {
      message.classList.add("show");
    }, 10);

    setTimeout(() => {
      message.classList.remove("show");

      setTimeout(() => {
        message.remove();
      }, 250);

    }, 2200);
  }


  /* =========================
     RESULT
  ========================= */

  function showResult() {

    const resultScreen =
      document.querySelector(
        '.wizard-screen[data-step="result"]'
      );

    if (!resultScreen) {
      /*
        Fallback for the original HTML where result
        may not have a data-step="result".
      */

      const possibleResult =
        document.querySelector(".wizard-result");

      if (possibleResult) {
        wizardScreens.forEach((screen) => {
          screen.classList.remove("active");
        });

        possibleResult.classList.add("active");
      }

    } else {

      wizardScreens.forEach((screen) => {
        screen.classList.remove("active");
      });

      resultScreen.classList.add("active");
    }


    if (wizardStep) {
      wizardStep.textContent = "BRIEF";
    }

    if (wizardProgress) {
      wizardProgress.style.width = "100%";
    }

    if (wizardBack) {
      wizardBack.style.visibility = "hidden";
    }


    /*
      Populate result fields.
    */

    setResultText(resultType, answers.type);
    setResultText(resultLanguage, answers.language);
    setResultText(resultGenre, answers.genre);
    setResultText(resultHave, answers.have);
    setResultText(resultNeed, answers.need);


    if (resultSummary) {

      const typeText =
        formatList(answers.type);

      const genreText =
        formatList(answers.genre);

      const needText =
        formatList(answers.need);

      resultSummary.textContent =
        `You’re looking to develop ${typeText.toLowerCase()} in ${answers.language}, with a ${genreText.toLowerCase()} direction. You currently have ${formatList(answers.have).toLowerCase()} and need ${needText.toLowerCase()}.`;
    }


    /*
      Pricing
    */

    let priceText = "Starting price: discussed based on the brief.";

    const hasStoryWriting =
      answers.type.some((item) =>
        item.toLowerCase().includes("story writing")
      );

    const hasScript =
      answers.type.some((item) =>
        item.toLowerCase().includes("audio story")
      ) ||
      answers.need.some((item) =>
        item.toLowerCase().includes("story + script")
      );

    const needsFullWriting =
      answers.need.some((item) =>
        item.toLowerCase().includes("full writing")
      );


    if (hasScript && (hasStoryWriting || needsFullWriting)) {

      priceText =
        "Starting price: ₹0.200 / word";

    } else if (
      hasStoryWriting ||
      needsFullWriting
    ) {

      priceText =
        "Starting price: ₹0.175 / word";
    }


    if (estimate) {
      estimate.textContent = priceText;
    }


    /*
      Result screen animation
    */

    const activeResult =
      document.querySelector(
        ".wizard-result.active, .wizard-screen[data-step='result'].active"
      );

    if (activeResult) {
      activeResult.classList.add("result-reveal");

      setTimeout(() => {
        activeResult.classList.remove("result-reveal");
      }, 700);
    }
  }


  function setResultText(element, value) {

    if (!element) return;

    if (Array.isArray(value)) {
      element.textContent =
        value.length
          ? value.join(" · ")
          : "—";

      return;
    }

    element.textContent =
      value || "—";
  }


  function formatList(items) {

    if (!Array.isArray(items)) {
      return items || "";
    }

    if (items.length === 0) {
      return "nothing selected";
    }

    if (items.length === 1) {
      return items[0];
    }

    if (items.length === 2) {
      return `${items[0]} + ${items[1]}`;
    }

    return (
      items.slice(0, -1).join(", ") +
      " + " +
      items[items.length - 1]
    );
  }


  /* =========================
     EMAIL
  ========================= */

  if (emailButton) {

    emailButton.addEventListener("click", () => {

      if (
        !STUDIO_EMAIL ||
        STUDIO_EMAIL === "YOUR_STUDIO_EMAIL_HERE"
      ) {

        emailButton.textContent =
          "EMAIL NOT CONFIGURED YET";

        emailButton.classList.add("email-error");

        setTimeout(() => {
          emailButton.textContent =
            "EMAIL THE BRIEF ↗";

          emailButton.classList.remove("email-error");

        }, 2600);

        return;
      }


      const subject =
        `New Story Brief — ${formatList(answers.type)}`;


      const body = `
DRAFTORALE STUDIO — NEW STORY BRIEF

PROJECT TYPE
${formatList(answers.type)}

LANGUAGE
${answers.language}

GENRE
${formatList(answers.genre)}

WHAT I HAVE
${formatList(answers.have)}

WHAT I NEED
${formatList(answers.need)}

STARTING PRICE
${estimate ? estimate.textContent : "Discussed based on brief."}

---

I understand that this is an initial brief and that the project will be discussed personally before confirmation.
      `.trim();


      const mailto =
        `mailto:${STUDIO_EMAIL}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;


      emailButton.classList.add("email-opened");

      window.location.href = mailto;


      setTimeout(() => {
        emailButton.textContent =
          "BRIEF READY ✓";
      }, 300);
    });
  }


  /* =========================
     RESTART
  ========================= */

  if (restartButton) {
    restartButton.addEventListener("click", () => {
      resetWizard();
    });
  }


  /* =========================
     INITIAL BUTTON STATES
  ========================= */

  for (let step = 1; step <= 5; step++) {
    updateContinueButton(step);
  }


  /* =========================
     ESCAPE HTML
  ========================= */

  window.escapeHTML = function (value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };


  /* =========================
     SCROLL REVEAL
  ========================= */

  const revealElements =
    document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        (entries, obs) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add("visible");

              obs.unobserve(entry.target);
            }
          });

        },
        {
          threshold: 0.12
        }
      );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }


  /* =========================
     SERVICE HOVER LIGHT
  ========================= */

  const serviceCards =
    document.querySelectorAll(".service-card");

  serviceCards.forEach((card) => {

    card.addEventListener("pointermove", (event) => {

      const rect =
        card.getBoundingClientRect();

      const x =
        event.clientX - rect.left;

      const y =
        event.clientY - rect.top;

      card.style.setProperty(
        "--mouse-x",
        `${x}px`
      );

      card.style.setProperty(
        "--mouse-y",
        `${y}px`
      );
    });
  });


  /* =========================
     BODY SCROLL SAFETY
  ========================= */

  window.addEventListener("resize", () => {

    if (
      !wizard?.classList.contains("open")
    ) {
      document.body.classList.remove("wizard-open");
    }

  });


  /*
    Initial wizard state.
  */

  if (wizard) {
    showStep(1);
  }

});
