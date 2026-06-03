const navbar = document.getElementById("navbar");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");
const revealElements = document.querySelectorAll(".reveal");

const mainTime = document.getElementById("mainTime");
const msTime = document.getElementById("msTime");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");
const clearLapsBtn = document.getElementById("clearLapsBtn");
const lapList = document.getElementById("lapList");
const lapCount = document.getElementById("lapCount");
const bestLap = document.getElementById("bestLap");
const lastLap = document.getElementById("lastLap");
const statusPill = document.getElementById("statusPill");
const statusText = document.getElementById("statusText");

let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let laps = [];
let previousLapElapsed = 0;

function formatTime(milliseconds) {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = Math.floor(milliseconds % 1000);

  return {
    main: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    milli: `.${String(ms).padStart(3, "0")}`
  };
}

function displayTime(milliseconds) {
  const formatted = formatTime(milliseconds);
  mainTime.textContent = formatted.main;
  msTime.textContent = formatted.milli;
}

function setStatus(status) {
  statusText.textContent = status;

  if (status === "Running") {
    statusPill.classList.add("running");
  } else {
    statusPill.classList.remove("running");
  }
}

function updateButtons() {
  startBtn.disabled = isRunning;
  pauseBtn.disabled = !isRunning;
  lapBtn.disabled = !isRunning;
}

function startStopwatch() {
  if (isRunning) return;

  startTime = Date.now() - elapsedTime;

  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    displayTime(elapsedTime);
  }, 10);

  isRunning = true;
  setStatus("Running");
  updateButtons();
}

function pauseStopwatch() {
  if (!isRunning) return;

  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;

  setStatus("Paused");
  updateButtons();
}

function resetStopwatch() {
  clearInterval(timerInterval);
  timerInterval = null;

  startTime = 0;
  elapsedTime = 0;
  previousLapElapsed = 0;
  isRunning = false;

  displayTime(0);
  setStatus("Ready");
  updateButtons();

  laps = [];
  renderLaps();
}

function createEmptyLapMessage() {
  lapList.innerHTML =
    `<li class="empty-laps">
      No laps recorded yet. Click <strong>Lap</strong> while the stopwatch is running.
    </li>`;
}

function updateLapStats() {
  lapCount.textContent = laps.length;

  if (laps.length === 0) {
    bestLap.textContent = "--";
    lastLap.textContent = "--";
    return;
  }

  const shortestLap = laps.reduce(
    (best, lap) => lap.split < best.split ? lap : best,
    laps[0]
  );

  bestLap.textContent = formatTime(shortestLap.split).main;
  lastLap.textContent = formatTime(laps[0].split).main;
}

function renderLaps() {
  if (laps.length === 0) {
    createEmptyLapMessage();
    updateLapStats();
    return;
  }

  lapList.innerHTML = laps.map(lap => {
    const total = formatTime(lap.total);
    const split = formatTime(lap.split);

    return `
      <li class="lap-item">
        <span class="lap-number">Lap ${lap.number}</span>
        <span class="lap-time">${total.main}${total.milli}</span>
        <span class="lap-split">+${split.main}${split.milli}</span>
      </li>
    `;
  }).join("");

  updateLapStats();
}

function recordLap() {
  if (!isRunning) return;

  const splitTime = elapsedTime - previousLapElapsed;
  previousLapElapsed = elapsedTime;

  laps.unshift({
    number: laps.length + 1,
    total: elapsedTime,
    split: splitTime
  });

  renderLaps();
}

function clearLaps() {
  laps = [];
  previousLapElapsed = elapsedTime;
  renderLaps();
}

startBtn.addEventListener("click", startStopwatch);
pauseBtn.addEventListener("click", pauseStopwatch);
resetBtn.addEventListener("click", resetStopwatch);
lapBtn.addEventListener("click", recordLap);
clearLapsBtn.addEventListener("click", clearLaps);

document.addEventListener("keydown", (event) => {
  const activeTag = document.activeElement.tagName.toLowerCase();

  if (activeTag === "input" || activeTag === "textarea") return;

  if (event.code === "Space") {
    event.preventDefault();
    isRunning ? pauseStopwatch() : startStopwatch();
  }

  if (event.key.toLowerCase() === "l") recordLap();
  if (event.key.toLowerCase() === "r") resetStopwatch();
  if (event.key.toLowerCase() === "c") clearLaps();
});

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

function updateActiveLink() {
  let current = "home";

  sections.forEach(section => {
    const top = section.offsetTop - 170;
    const height = section.offsetHeight;

    if (
      window.scrollY >= top &&
      window.scrollY < top + height
    ) {
      current = section.id;
    }
  });

  navItems.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

function revealOnScroll() {
  revealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < window.innerHeight - 115) {
      element.classList.add("show");
    }
  });
}

window.addEventListener("scroll", () => {
  updateNavbar();
  updateActiveLink();
  revealOnScroll();
});

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  menuBtn.textContent =
    navLinks.classList.contains("show") ? "✕" : "☰";
});

navItems.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
    menuBtn.textContent = "☰";
  });
});

displayTime(0);
createEmptyLapMessage();
updateButtons();
updateNavbar();
updateActiveLink();
revealOnScroll();
