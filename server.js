const express = require("express");
const { evaluate } = require("mathjs");
const app = express();
let history = [];

app.use(express.static("public"));
app.use(express.json());

app.get("/", function (req, res) {
    res.send("Hello from my server!");
});

app.post("/greet", function (req, res) {
    const name = req.body.name;
    res.send("Hello, " + name + "!");
});

app.post("/calculate", function (req, res) {
    const number1 = req.body.number1;
    const operator = req.body.operator;
    const number2 = req.body.number2;

    let result;

    if (operator === "+") {
        result = Number(number1) + Number(number2);
    } else if (operator === "-") {
        result = Number(number1) - Number(number2);
    } else if (operator === "*") {
        result = Number(number1) * Number(number2);
    } else if (operator === "/") {
        result = Number(number1) / Number(number2);
    }

    res.send(String(result));
});

app.post("/evaluate", function (req, res) {
    const expression = req.body.expression;
    try {
        const result = evaluate(expression);
        const rounded = Math.round(result * 10000000000) / 10000000000;
        history.push({ expression: expression, result: rounded });
        res.send(String(rounded));
    } catch (error) {
        res.status(400).send("Invalid expression");
    }
});

app.get("/history", function (req, res) {
    res.json(history);
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});