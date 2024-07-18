var total = document.getElementById("total");
var netPrize = document.getElementsByClassName("netPrize");
function totalResult(){
  var cal = 0;
    for (let i = 0; i < netPrize.length; i++) {
      cal += parseInt(netPrize[i].innerText)
      
    }
    total.innerHTML= cal;
}
function quantityfunc(q) {
    var priceValue = q.parentElement.parentElement.children[1].children[0].value;
    q.parentElement.parentElement.children[2].innerHTML = q.value * priceValue;
    totalResult()
}

function pricefunc(p) {
   var quantityValue = p.parentElement.parentElement.children[0].children[0].value;
   p.parentElement.parentElement.children[2].innerHTML = p.value * quantityValue;
   totalResult()
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
});

// script.js
const refreshButton = document.getElementById("refreshButton");

refreshButton.addEventListener("click", () => {
// Reload the page
location.reload();
});
