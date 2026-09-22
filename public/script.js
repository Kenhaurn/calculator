const display = document.getElementById("display");
const one = document.getElementById("one");
const two = document.getElementById("two");
const three = document.getElementById("three");
const four = document.getElementById("four");
const five = document.getElementById("five");
const six = document.getElementById("six");
const seven = document.getElementById("seven");
const eight = document.getElementById("eight");
const nine = document.getElementById("nine");
const zero = document.getElementById("zero");
const divide = document.getElementById("divide");
const add = document.getElementById("add");
const subtract = document.getElementById("subtract");
const multiply = document.getElementById("multiply");
const equalTo = document.getElementById("equalTo");
const clear = document.getElementById("clear");
const modeToggle = document.getElementById("modeToggle")
const decimal = document.getElementById("decimal");
const backSpace = document.getElementById("backSpace");
const sin = document.getElementById("sin");
const cos = document.getElementById("cos");
const tan = document.getElementById("tan");
const openBracket = document.getElementById("openBracket")
const closeBracket = document.getElementById("closeBracket")
const log = document.getElementById("log");
const ln = document.getElementById("ln");
const sqrt = document.getElementById("sqrt");
const power = document.getElementById("power");
const factorial = document.getElementById("factorial");
const pi = document.getElementById("pi");
const euler = document.getElementById("euler");


const bracket = [openBracket, closeBracket];
const sciFun = [sin, cos, tan, log, ln];
const digitButtons = [one, two, three, four, five, six, seven, eight, nine, zero];
const digitKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const operators = [add, subtract, multiply, divide, power];
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
};

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
            console.log(data);
            display.textContent = data;
        });
};

function backspace() {
    tokens.pop();
    render();
}

function clearAll() {
    tokens = [];
    render();
}

for (let i = 0; i < digitButtons.length; i++) {
    digitButtons[i].addEventListener("click", function () {
        const val = digitButtons[i].textContent;
        pushToken(val, val);
    });
}

for (let i = 0; i < operators.length; i++) {
    operators[i].addEventListener("click", function () {
        const val = operators[i].textContent;
        pushToken(val, val);
    });
}

for (let i = 0; i < sciFun.length; i++) {
    sciFun[i].addEventListener("click", function () {
        const val = sciFun[i].textContent + "(";
        pushToken(val, val);
    });
}

for (let i = 0; i < bracket.length; i++) {
    bracket[i].addEventListener("click", function () {
        const val = bracket[i].textContent;
        pushToken(val, val);
    });
}

factorial.addEventListener("click", function () {
    pushToken("!", "!");
})

pi.addEventListener("click", function () {
    pushToken("pi", "π");
})

euler.addEventListener("click", function () {
    pushToken("e", "e");
})

decimal.addEventListener("click", function () {
    pushToken(".", ".");
});

sqrt.addEventListener("click", function () {
    pushToken("sqrt(", "√(");
});

clear.addEventListener("click", clearAll);

backSpace.addEventListener("click", backspace);

modeToggle.addEventListener("click", function () {
    isDegreeMode = !isDegreeMode;
    if (isDegreeMode === true) {
        modeToggle.textContent = "DEG";
    } else {
        modeToggle.textContent = "RAD";
    }
});

equalTo.addEventListener("click", function () {
    evaluateExpression();
})

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

