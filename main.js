const container = document.getElementById("container");
const imageOne = document.querySelector(".image-1");
const imageTwo = document.querySelector(".image-2");
const btnYes = document.querySelector(".btn-yes");
const btnNo = document.querySelector(".btn-no");
const text1 = document.getElementById("text1");

// Typing effect
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

// Send response via Formsubmit
function sendResponse(response) {
  document.getElementById("responseInput").value = response;
  document.getElementById("responseForm").submit();
}

// Yes button
function yesAction() {
  sendResponse("Yes");
  btnNo.classList.add("hide");
  imageOne.classList.add("hide");
  imageTwo.classList.remove("hide");
}

btnYes.addEventListener("click", yesAction);
btnYes.addEventListener("touchstart", (e) => { yesAction(); e.preventDefault(); });

// No button escape logic
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function moveButton() {
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
    (newTop < textRect.bottom + buffer) || // avoid text
    (newLeft + btnWidth > yesRect.left - buffer &&
     newLeft < yesRect.right + buffer &&
     newTop + btnHeight > yesRect.top - buffer &&
     newTop < yesRect.bottom + buffer)      // avoid Yes button
  );

  // Keep within screen
  newTop = Math.min(Math.max(newTop, edgeBuffer), maxTop);
  newLeft = Math.min(Math.max(newLeft, edgeBuffer), maxLeft);

  btnNo.style.top = `${newTop}px`;
  btnNo.style.left = `${newLeft}px`;
  btnNo.style.transform = "none";
}

btnNo.addEventListener("mouseover", moveButton);
btnNo.addEventListener("click", () => { sendResponse("No"); moveButton(); });
btnNo.addEventListener("touchstart", (e) => { sendResponse("No"); moveButton(); e.preventDefault(); });

// Initial placement under GIF
window.addEventListener("load", () => {
  const imageRect = imageOne.getBoundingClientRect();
  const topPos = imageRect.bottom + 100;

  btnYes.style.top = `${topPos}px`;
  btnYes.style.left = "calc(50% - 110px)";

  btnNo.style.top = `${topPos}px`;
  btnNo.style.left = "calc(50% + 10px)";
});
