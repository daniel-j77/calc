let outputScreen = document.getElementById("output-screen");
function display(num) {
  outputScreen.value += num;
  document.getElementById("clear-btn").innerText = "C";
}
function del() {
  outputScreen.value = outputScreen.value.slice(0, -1);
}
// Show startup screen only once using sessionStorage
window.addEventListener("DOMContentLoaded", () => {
  const hasVisited = sessionStorage.getItem("visited");
  const startup = document.getElementById("startup-screen");
  if (!hasVisited) {
    setTimeout(() => {
      startup.style.opacity = "0";
      setTimeout(() => {
        startup.style.display = "none";
      }, 1000);
    }, 2000); // Show logo for 2 seconds
    sessionStorage.setItem("visited", "true");
  } else {
    startup.style.display = "none";
  }
});
let acPressCount = 0;

function scientific(func) {
  try {
    const value = parseFloat(outputScreen.value);
    let result;
    switch (func) {
      case "sin":
        result = Math.sin((value * Math.PI) / 180); // convert to radians
        break;
      case "cos":
        result = Math.cos((value * Math.PI) / 180);
        break;
      case "log":
        result = Math.log10(value);
        break;
      case "tan":
        result = Math.tan((value * Math.PI) / 180);
        break;
      case "sqrt":
        result = Math.sqrt(value);
        break;
      case "pow":
        const base = parseFloat(prompt("Enter base:", value));
        const exponent = parseFloat(prompt("Enter exponent:"));
        result = Math.pow(base, exponent);
        const now = new Date();
        const timestamp = now.toLocaleString();
        saveHistory(`${timestamp} → pow(${base}, ${exponent}) = ${result}`);
        outputScreen.value = result;
        return;
      case "pi":
        result = Math.PI;
        break;
    }
    outputScreen.value = result;
    const now = new Date();
    const timestamp = now.toLocaleString();
    saveHistory(`${timestamp} → ${func}(${value}) = ${result}`);
  } catch (err) {
    alert("Invalid Input");
  }
}

function saveHistory(entry) {
  let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.push(entry);
  localStorage.setItem("calcHistory", JSON.stringify(history));
}

function showHistory() {
  let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  if (history.length === 0) {
    alert("No history found.");
  } else {
    alert("Calculation History:\n\n" + history.join("\n"));
  }
}

// Modify the original Calculate function:
function Calculate() {
  try {
    let expr = outputScreen.value;
    let result = eval(expr);
    outputScreen.value = result;
    const now = new Date();
    const timestamp = now.toLocaleString();
    saveHistory(`${timestamp} → ${expr} = ${result}`);
    acPressCount = 0; // Reset AC count
  } catch (err) {
    alert("Invalid");
  }
}

// Modify Clear function:
function Clear() {
  const clearBtn = document.getElementById("clear-btn");

  if (outputScreen.value !== "") {
    outputScreen.value = "";
    clearBtn.innerText = "AC";
    acPressCount = 1;
  } else {
    acPressCount++;
    if (acPressCount >= 2) {
      localStorage.removeItem("calcHistory");
      alert("Calculation history cleared.");
      acPressCount = 0;
    }
  }
}
// Enable keyboard support:
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (!isNaN(key) || "+-*/.%".includes(key)) {
    display(key);
  } else if (key === "=" || key === "Enter") {
    event.preventDefault(); // Prevent form submission if inside a form
    Calculate();
  } else if (key === "Backspace") {
    del();
  } else if (key === "Delete") {
    Clear();
  } else if (key === "^") {
    scientific("pow");
  } else if (key.toLowerCase() === "p") {
    scientific("pi");
  } else if (key.toLowerCase() === "s") {
    scientific("sin"); // sin(θ)
  } else if (key.toLowerCase() === "c") {
    scientific("cos"); // cos(θ)
  } else if (key.toLowerCase() === "t") {
    scientific("tan");
  } else if (key.toLowerCase() === "l") {
    scientific("log"); // log₁₀(x)
  } else if (key.toLowerCase() === "r") {
    scientific("sqrt"); // sqrt() - assigned R if S is used for sin
  } else if (key.toLowerCase() === "h") {
    showHistory(); // Displays calculation history
  }
});
