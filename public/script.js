const display = document.getElementById("display");
const keypad = document.getElementById("keypad");
const equalTo = document.getElementById("equalTo");
const clear = document.getElementById("clear");
const backSpace = document.getElementById("backSpace");
const modeToggle = document.getElementById("modeToggle");
const historyButton = document.getElementById("historyButton");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");

const digitKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const operatorKeys = ["/", "*", "+", "-"];

let isDegreeMode = true;
let tokens = [];

function pushToken(value, displayValue) {
    tokens.push({ value: value, display: displayValue });
    render();
}

function render() {
    display.textContent = tokens.map(function (t) { return t.display; }).join("") || "0";
}

function getExpressionString() {
    return tokens.map(function (t) { return t.value; }).join("");
}

function applyDegreeMode(expr) {
    if (!isDegreeMode) {
        return expr;
    }
    return expr.replace(/(sin|cos|tan)\(([^()]+)\)/g, "$1(($2) deg)");
}

function backspace() {
    tokens.pop();
    render();
}

function clearAll() {
    tokens = [];
    render();
}

function evaluateExpression() {
    fetch("/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression: applyDegreeMode(getExpressionString()) }),
    })
        .then(function (response) {
            return response.text();
        })
        .then(function (data) {
            display.textContent = data;
            loadHistory();
        });
}

function loadHistory() {
    fetch("/history")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            historyList.innerHTML = "";
            for (let i = 0; i < data.length; i++) {
                const item = document.createElement("li");
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "delete";
                deleteButton.addEventListener("click", function () {
                    fetch("/history/" + data[i].id, { method: "DELETE" })
                        .then(function () {
                            loadHistory();
                        });
                });
                item.textContent = data[i].expression + " = " + data[i].result;
                item.appendChild(deleteButton);
                historyList.appendChild(item);
            }
        });
}

// ---------- Event delegation: ONE listener for the entire keypad ----------

keypad.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    const value = button.dataset.value;
    const displayValue = button.dataset.display;
    pushToken(value, displayValue);
});

// ---------- Buttons with unique behavior (not simple token pushes) ----------

clear.addEventListener("click", clearAll);
backSpace.addEventListener("click", backspace);
equalTo.addEventListener("click", evaluateExpression);

modeToggle.addEventListener("click", function () {
    isDegreeMode = !isDegreeMode;
    modeToggle.textContent = isDegreeMode ? "DEG" : "RAD";
});

historyButton.addEventListener("click", function () {
    if (historyPanel.style.display === "none") {
        historyPanel.style.display = "block";
    } else {
        historyPanel.style.display = "none";
    }
});

// ---------- Keyboard support ----------

document.addEventListener("keydown", function (event) {
    if (digitKeys.includes(event.key)) {
        pushToken(event.key, event.key);
    } else if (operatorKeys.includes(event.key)) {
        pushToken(event.key, event.key);
    } else if (event.key === ".") {
        pushToken(event.key, event.key);
    } else if (event.key === "Backspace") {
        backspace();
    } else if (event.key === "Enter") {
        event.preventDefault();
        evaluateExpression();
    }
});