/* DRAFTORALE STUDIO — V2 */

const body = document.body;


/* =========================
   THEME
========================= */

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("draftorale-theme");

if(savedTheme === "light"){
  body.classList.add("light");
}

themeToggle.addEventListener("click", () => {

  body.classList.toggle("light");

  localStorage.setItem(
    "draftorale-theme",
    body.classList.contains("light") ? "light" : "dark"
  );

});


/* =========================
   HEADER
========================= */

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

  if(window.scrollY > 40){
    header.classList.add("scrolled");
  }else{
    header.classList.remove("scrolled");
  }

});


/* =========================
   SCROLL PROGRESS
========================= */

const progress = document.querySelector(".scroll-progress span");

window.addEventListener("scroll", () => {

  const scrollTop = window.scrollY;

  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const percentage = height > 0
    ? (scrollTop / height) * 100
    : 0;

  progress.style.width = percentage + "%";

});


/* =========================
   CURSOR LIGHT
========================= */

const cursorGlow = document.querySelector(".cursor-glow");

if(window.matchMedia("(pointer:fine)").matches){

  window.addEventListener("mousemove", (event) => {

    cursorGlow.style.left = event.clientX + "px";
    cursorGlow.style.top = event.clientY + "px";

  });

}else{

  cursorGlow.style.display = "none";

}


/* =========================
   SAMPLE TABS
========================= */

const sampleButtons =
  document.querySelectorAll(".sample-tabs button");

const samples =
  document.querySelectorAll(".sample");

const sampleType =
  document.getElementById("sampleType");

const sampleNumber =
  document.getElementById("sampleNumber");


const sampleNames = {

  "en-story": ["ENGLISH · STORY","01 / 06"],
  "bn-story": ["BENGALI · STORY","02 / 06"],
  "hi-story": ["HINDI · STORY","03 / 06"],
  "en-script": ["ENGLISH · SCRIPT","04 / 06"],
  "hi-script": ["HINDI · SCRIPT","05 / 06"],
  "bn-script": ["BENGALI · SCRIPT","06 / 06"]

};


sampleButtons.forEach(button => {

  button.addEventListener("click", () => {

    const target = button.dataset.sample;

    sampleButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    samples.forEach(sample => {
      sample.classList.remove("active");
    });

    const selected =
      document.getElementById(target);

    if(selected){
      selected.classList.add("active");
    }

    if(sampleNames[target]){

      sampleType.textContent =
        sampleNames[target][0];

      sampleNumber.textContent =
        sampleNames[target][1];

    }

  });

});


/* =========================
   WIZARD
========================= */

const wizard =
  document.getElementById("wizard");

const startButton =
  document.getElementById("startButton");

const headerStart =
  document.querySelector(".header-start");

const wizardClose =
  document.getElementById("wizardClose");

const wizardBack =
  document.getElementById("wizardBack");

const restartWizard =
  document.getElementById("restartWizard");

const wizardStep =
  document.getElementById("wizardStep");

const wizardProgress =
  document.getElementById("wizardProgress");

const wizardScreens =
  document.querySelectorAll(".wizard-screen");

const wizardResult =
  document.getElementById("wizardResult");

const briefSummary =
  document.getElementById("briefSummary");

const estimatePrice =
  document.getElementById("estimatePrice");

const emailButton =
  document.getElementById("emailButton");


let currentStep = 1;

let answers = {

  type:"",
  language:"",
  genre:"",
  have:"",
  need:""

};


/* OPEN */

function openWizard(){

  wizard.classList.add("open");

  document.body.style.overflow = "hidden";

  resetWizard();

}


/* CLOSE */

function closeWizard(){

  wizard.classList.remove("open");

  document.body.style.overflow = "";

}


startButton.addEventListener("click", openWizard);

if(headerStart){
  headerStart.addEventListener("click", openWizard);
}

wizardClose.addEventListener("click", closeWizard);


/* CLICK BACKDROP */

wizard.addEventListener("click", event => {

  if(event.target.classList.contains("wizard-backdrop")){
    closeWizard();
  }

});


/* ESC */

document.addEventListener("keydown", event => {

  if(event.key === "Escape"){
    closeWizard();
  }

});


/* SHOW STEP */

function showStep(step){

  currentStep = step;

  wizardScreens.forEach(screen => {

    screen.classList.remove("active");

    if(Number(screen.dataset.step) === step){
      screen.classList.add("active");
    }

  });

  wizardResult.classList.remove("show");

  wizardStep.textContent =
    String(step).padStart(2,"0") + " / 05";

  wizardProgress.style.width =
    ((step / 5) * 100) + "%";

  wizardBack.style.visibility =
    step === 1 ? "hidden" : "visible";

}


/* CHOICES */

document.querySelectorAll(
  ".wizard-screen button[data-value]"
).forEach(button => {

  button.addEventListener("click", () => {

    const value = button.dataset.value;

    if(currentStep === 1){
      answers.type = value;
    }

    if(currentStep === 2){
      answers.language = value;
    }

    if(currentStep === 3){
      answers.genre = value;
    }

    if(currentStep === 4){
      answers.have = value;
    }

    if(currentStep === 5){
      answers.need = value;
      showResult();
      return;
    }

    showStep(currentStep + 1);

  });

});


/* BACK */

wizardBack.addEventListener("click", () => {

  if(currentStep > 1){
    showStep(currentStep - 1);
  }

});


/* RESET */

function resetWizard(){

  answers = {

    type:"",
    language:"",
    genre:"",
    have:"",
    need:""

  };

  showStep(1);

}


/* RESULT */

function showResult(){

  wizardScreens.forEach(screen => {
    screen.classList.remove("active");
  });

  wizardResult.classList.add("show");

  wizardStep.textContent = "READY";

  wizardProgress.style.width = "100%";

  wizardBack.style.visibility = "hidden";


  briefSummary.innerHTML = `

    <div class="brief-item">
      <span>PROJECT</span>
      <strong>${escapeHTML(answers.type)}</strong>
    </div>

    <div class="brief-item">
      <span>LANGUAGE</span>
      <strong>${escapeHTML(answers.language)}</strong>
    </div>

    <div class="brief-item">
      <span>GENRE</span>
      <strong>${escapeHTML(answers.genre)}</strong>
    </div>

    <div class="brief-item">
      <span>YOU HAVE</span>
      <strong>${escapeHTML(answers.have)}</strong>
    </div>

    <div class="brief-item">
      <span>YOU NEED</span>
      <strong>${escapeHTML(answers.need)}</strong>
    </div>

  `;


  let price = "Discuss";

  if(answers.need === "Story + script"){

    price = "₹0.200 / word";

  }else if(
    answers.type === "Story Writing" ||
    answers.need === "Full writing"
  ){

    price = "From ₹0.175 / word";

  }

  estimatePrice.textContent = price;


  const subject =
    "DRAFTORALE PROJECT — " +
    answers.type;

  const emailBody =

`Hello DRAFTORALE STUDIO,

I'd like to discuss a project.

PROJECT TYPE:
${answers.type}

LANGUAGE:
${answers.language}

GENRE:
${answers.genre}

WHAT I HAVE:
${answers.have}

WHAT I NEED:
${answers.need}

Please let me know if you'd like to discuss the project further.

Thank you.`;


  /*
    IMPORTANT:
    Replace this placeholder email with your
    actual DRAFTORALE studio email.
  */

  const studioEmail =
    "draftoralestudio@gmail.com";


  emailButton.href =
    "mailto:" +
    studioEmail +
    "?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(emailBody);

}


restartWizard.addEventListener("click", () => {

  resetWizard();

});


/* =========================
   HTML ESCAPE
========================= */

function escapeHTML(value){

  return String(value)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}


/* =========================
   REVEAL ON SCROLL
========================= */

const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if(entry.isIntersecting){

          entry.target.classList.add("visible");

        }

      });

    },
    {
      threshold:.12
    }
  );


document.querySelectorAll(
  ".service,.process-item,.manifesto-grid,.about-grid,.language-big"
).forEach(element => {

  observer.observe(element);

});


/* =========================
   SERVICE HOVER
========================= */

document.querySelectorAll(".service").forEach(service => {

  service.addEventListener("mousemove", event => {

    const rect = service.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width) * 100;

    service.style.background =
      `radial-gradient(circle at ${x}% 50%, rgba(215,185,138,.055), transparent 40%)`;

  });

  service.addEventListener("mouseleave", () => {

    service.style.background = "";

  });

});


/* =========================
   PREVENT BODY SCROLL
========================= */

window.addEventListener("resize", () => {

  if(!wizard.classList.contains("open")){
    document.body.style.overflow = "";
  }

});


/* =========================
   INITIAL STATE
========================= */

showStep(1);
