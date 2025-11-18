// ======= Elements =======
const container = document.getElementById("container");
const imageOne = document.querySelector(".image-1");
const imageTwo = document.querySelector(".image-2");
const imageThree = document.querySelector(".image-3");
const btnYes = document.querySelector(".btn-yes");
const btnNo = document.querySelector(".btn-no");
const text1 = document.getElementById("text1");

// ======= Typing animation =======
const text = ["Vũ Bảo Ngọc,", "will you", "be my", "girlfriend?"];
text1.innerHTML = "";
let line = 0, char = 0;

function typeLetter() {
  if (line < text.length) {
    if (char < text[line].length) {
      text1.innerHTML += text[line][char];
      char++;
      setTimeout(typeLetter, 50);
    } else {
      line++;
      char = 0;
      if (line < text.length) {
        text1.innerHTML += "<br>";
        setTimeout(typeLetter, 200);
      }
    }
  }
}
typeLetter();

// ======= Form submission function =======
let noCount = 0; // counts how many times "no" was pressed
function sendResponse(response) {
  document.getElementById("responseInput").value = response;
  document.getElementById("responseForm").submit();
}

// ======= "Yes" button logic =======
function yesAction() {
  sendResponse(`yes (pressed no ${noCount} times)`);
  btnNo.classList.add("hide");
  imageOne.classList.add("hide");
  imageTwo.classList.remove("hide"); // show happy GIF
}

btnYes.addEventListener("click", yesAction);
btnYes.addEventListener("touchstart", (e) => { yesAction(); e.preventDefault(); });

// ======= "No" button logic =======
const noTexts = [
  "no", // This matches the initial HTML text
  "really?",
  "reallyyy?!??!",
  "please be mine",
  "HUHHHHHH",
  ":(",
  "you're breaking my heart",
  "i'm on my knees for you",
  "okay i will try harder next time" // last message triggers sad GIF
];
let noIndex = 0; // Start at 0 to match the initial "no" text
let stopMoving = false; // flag to stop moving button after last "no"

// Utility to get random number
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Move "No" button randomly
function moveButton() {
  if (stopMoving) return; // do nothing if button should stop
  const btnHeight = btnNo.offsetHeight;
  const btnWidth = btnNo.offsetWidth;
  const buffer = 20;
  const edgeBuffer = 10;

  const textRect = text1.getBoundingClientRect();
  const yesRect = btnYes.getBoundingClientRect();

  const maxTop = window.innerHeight - btnHeight - edgeBuffer;
  const maxLeft = window.innerWidth - btnWidth - edgeBuffer;

  let newTop, newLeft, attempts = 0;

  do {
    newTop = getRandomNumber(edgeBuffer, maxTop);
    newLeft = getRandomNumber(edgeBuffer, maxLeft);
    attempts++;
    if (attempts > 300) break;
  } while (
    (newTop < textRect.bottom + buffer) || 
    (newLeft + btnWidth > yesRect.left - buffer &&
     newLeft < yesRect.right + buffer &&
     newTop + btnHeight > yesRect.top - buffer &&
     newTop < yesRect.bottom + buffer)
  );

  newTop = Math.min(Math.max(newTop, edgeBuffer), maxTop);
  newLeft = Math.min(Math.max(newLeft, edgeBuffer), maxLeft);

  btnNo.style.top = `${newTop}px`;
  btnNo.style.left = `${newLeft}px`;
  btnNo.style.transform = "none";
}

// ======= "No" button logic =======
btnNo.addEventListener("click", () => {
  noCount++; // increment counter

  // Check if this is the last message BEFORE updating text
  if (noIndex === noTexts.length - 1) {
    // Last "no" message - show sad GIF and submit form
    imageOne.classList.add("hide");       
    imageTwo.classList.add("hide");       
    imageThree.classList.remove("hide");  
    btnYes.style.display = "none";        
    
    stopMoving = true; // stop further movement

    // Submit form after a short delay
    setTimeout(() => {
      sendResponse(`no (pressed ${noCount} times)`);
    }, 100);
  } else {
    // Intermediate "no" messages - move the button and update text
    noIndex++; // Move to next text
    btnNo.textContent = noTexts[noIndex]; // Update button text
    moveButton();
  }
});

// Touch support
btnNo.addEventListener("touchstart", (e) => { 
  e.preventDefault();
  btnNo.click();
});

// ======= Position buttons under GIF on load =======
window.addEventListener("load", () => {
  const imageRect = imageOne.getBoundingClientRect();
  const topPos = imageRect.bottom + 30;
  const gap = 20;

  const yesWidth = btnYes.offsetWidth;
  const noWidth = btnNo.offsetWidth;

  const totalWidth = yesWidth + noWidth + gap;
  const startLeft = (window.innerWidth - totalWidth) / 2;

  btnYes.style.top = `${topPos}px`;
  btnYes.style.left = `${startLeft}px`;

  btnNo.style.top = `${topPos}px`;
  btnNo.style.left = `${startLeft + yesWidth + gap}px`;
});