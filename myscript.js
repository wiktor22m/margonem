// myscript.js
document.querySelectorAll("[data-charid]").forEach((elem) => {
  elem.addEventListener("click", () => {
    const charId = elem.getAttribute("data-charid");
    console.log(`Kliknięto element z data-charid: ${charId}`);
  });
});

// Automatyczne kliknięcie pierwszego elementu z data-charid
const firstElem = document.querySelector("[data-charid]");
if (firstElem) firstElem.click();
