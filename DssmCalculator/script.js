// script.js
const total = document.getElementById("total");
const netPrize = document.getElementsByClassName("netPrize");
const quantityInputs = document.querySelectorAll("tbody input[type='text']");

// Load saved data from local storage (if any)
const savedData = JSON.parse(localStorage.getItem("salesCalculatorData")) || [];

function totalResult() {
    let cal = 0;
    for (let i = 0; i < netPrize.length; i++) {
        const netPrizeValue = parseFloat(netPrize[i].innerText);
        cal += isNaN(netPrizeValue) ? 0 : netPrizeValue;
    }
    total.innerHTML = cal.toFixed(2);

    // Save data to local storage
    const dataToSave = Array.from(netPrize).map((el) => parseFloat(el.innerText));
    localStorage.setItem("salesCalculatorData", JSON.stringify(dataToSave));
}

function quantityfunc(q) {
    const priceValue = parseFloat(q.parentElement.parentElement.children[1].children[0].value);
    q.parentElement.parentElement.children[2].innerHTML = (q.value * priceValue).toFixed(2);
    totalResult();
    saveUserInput();
}

function pricefunc(p) {
    const quantityValue = parseFloat(p.parentElement.parentElement.children[0].children[0].value);
    p.parentElement.parentElement.children[2].innerHTML = (p.value * quantityValue).toFixed(2);
    totalResult();
    saveUserInput();
}

function saveUserInput() {
    const userInput = Array.from(quantityInputs).map((input) => input.value);
    localStorage.setItem("userInput", JSON.stringify(userInput));
}

// Assuming you have a button with an ID "addRowButton" to trigger row addition
const addRowButton = document.getElementById("addRowButton");
const tableBody = document.querySelector("tbody");

addRowButton.addEventListener("click", () => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td><input type="text" onkeyup="quantityfunc(this)"></td>
        <td><input type="text" onkeyup="pricefunc(this)"></td>
        <td class="netPrize">0</td>
    `;
    tableBody.appendChild(newRow);
    totalResult();
    saveUserInput();
});

// Assuming you have a button with an ID "refreshButton" to trigger page refresh
const refreshButton = document.getElementById("refreshButton");

refreshButton.addEventListener("click", () => {
    location.reload();
});

// Clear button functionality
const clearButton = document.getElementById("clearButton");

clearButton.addEventListener("click", () => {
    quantityInputs.forEach((input) => (input.value = ""));
    Array.from(netPrize).forEach((el) => (el.innerText = "0"));
    totalResult();
    localStorage.removeItem("salesCalculatorData");
    localStorage.removeItem("userInput");
});

// Load saved data on page load
savedData.forEach((value, index) => {
    netPrize[index].innerText = value.toFixed(2);
});

const loadedUserInput = JSON.parse(localStorage.getItem("userInput")) || [];
quantityInputs.forEach((input, index) => {
    input.value = loadedUserInput[index] || "";
});
totalResult();

