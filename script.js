const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let expression = "";
let justCalculated = false;

function updateDisplay() {
  display.value = expression || "0";
}

function addToExpression(value) {
  const isOperator = ["+", "-", "*", "/"].includes(value);

  if (justCalculated && !isOperator) expression = "";
  justCalculated = false;

  if (isOperator) {
    if (expression === "" && value !== "-") return;
    const lastChar = expression.slice(-1);
    if (["+", "-", "*", "/"].includes(lastChar)) {
      expression = expression.slice(0, -1);
    }
  }

  if (value === ".") {
    const currentNumber = expression.split(/[+\-*/]/).pop();
    if (currentNumber.includes(".")) return;
    if (currentNumber === "") value = "0.";
  }

  expression += value;
  updateDisplay();
}

function calculate() {
  if (!expression) return;

  // Allow only calculator characters before evaluating the expression.
  if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
    display.value = "Invalid input";
    expression = "";
    return;
  }

  try {
    const result = Function('"use strict"; return (' + expression + ')')();
    if (!Number.isFinite(result)) {
      display.value = "Cannot divide by 0";
      expression = "";
      return;
    }
    expression = String(Number(result.toFixed(10)));
    display.value = expression;
    justCalculated = true;
  } catch {
    display.value = "Error";
    expression = "";
  }
}

function handleAction(action) {
  if (action === "clear") {
    expression = "";
    justCalculated = false;
    updateDisplay();
  } else if (action === "delete") {
    expression = expression.slice(0, -1);
    updateDisplay();
  } else if (action === "calculate") {
    calculate();
  }
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.action) handleAction(button.dataset.action);
  else if (button.dataset.value) addToExpression(button.dataset.value);
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9.]$/.test(event.key) || ["+", "-", "*", "/"].includes(event.key)) {
    addToExpression(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    handleAction("delete");
  } else if (event.key === "Escape") {
    handleAction("clear");
  }
});

updateDisplay();