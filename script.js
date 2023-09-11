const inputContainer = document.querySelector(".input-container");
const countdonwForm = document.querySelector(".form-countdown");
const dateEl = document.querySelector("#date-picker");
const countdownEl = document.querySelector(".countdown");
const countdownTitleEl = document.querySelector(".countdown-title");
const btnCountdown = document.querySelector(".btn-countdown");
const timeEls = document.querySelectorAll("span");
const completeEl = document.querySelector(".complete");
const completeElInfo = document.querySelector(".complete-info");
const btnComplete = document.querySelector(".btn-complete");
const inputTitleEl = document.querySelector('input[type="text"]');
const inputDateEl = document.querySelector('input[type="date"]');

let countdownTitle = "";
let countdownDate = "";
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input Min with Today's Date
const today = new Date().toISOString().split("T")[0];
dateEl.setAttribute("min", today);

// Populate Countdown / Complete UI
const updateDOM = function () {
  countdownActive = setInterval(function () {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    // Hide input
    inputContainer.classList.add("hidden");

    // If the countdown has ended, show complete
    if (distance < 0) {
      countdownEl.classList.add("hidden");
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.classList.remove("hidden");
    } else {
      // Show the countdown in progress
      countdownTitleEl.textContent = `${countdownTitle}`;
      timeEls[0].textContent = `${days}`;
      timeEls[1].textContent = `${hours}`;
      timeEls[2].textContent = `${minutes}`;
      timeEls[3].textContent = `${seconds}`.padStart(2, 0);

      // Show Countdown
      completeEl.classList.add("hidden");
      countdownEl.classList.remove("hidden");
    }
  }, second);
};

// Take values from Form input
const updateCountdown = function (e) {
  e.preventDefault();
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };

  localStorage.setItem("countdown", JSON.stringify(savedCountdown));

  if (!countdownTitle || !countdownDate) {
    if (!countdownTitle) alert("Please enter a title!");
    if (!countdownDate) alert("Please select a date for the countdown!");
    return;
  }

  // Get number version of current Date , updateDOM
  countdownValue = new Date(countdownDate).getTime();

  updateDOM();
};

// Reset all Values
const reset = function () {
  inputTitleEl.value = inputDateEl.value = "";
  // Hide Countdown, show input
  inputContainer.classList.remove("hidden");
  completeEl.classList.add("hidden");
  countdownEl.classList.add("hidden");

  // Stop the countdown
  clearInterval(countdownActive);

  // Reset values
  countdownTitle = "";
  countdownDate = "";
  localStorage.removeItem("countdown");
};

function restorePrevCountdown() {
  // Get countdown from local storage
  const storage = localStorage.getItem("countdown");
  if (!storage) return;

  inputContainer.classList.add("hidden");
  savedCountdown = JSON.parse(storage);
  countdownTitle = savedCountdown.title;
  countdownDate = savedCountdown.date;
  countdownValue = new Date(countdownDate).getTime();
  updateDOM();
}

// Event Listeners
countdonwForm.addEventListener("submit", updateCountdown);
btnCountdown.addEventListener("click", reset);
btnComplete.addEventListener("click", reset);

restorePrevCountdown();
