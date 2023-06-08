const serverless = require("serverless-http");
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const materiasRouter = require('./routes/routerMaterias');

// Middleware
app.use(bodyParser.json());

// Endpoint root
app.get("/", (req, res, next) => {
    return res.status(200).json({
        message: "Welcome to API for Materias!",
    });
});

// Routes for Students endpoints
app.use('/materias', materiasRouter);

// Endpoint not found
app.use((req, res, next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

module.exports.handler = serverless(app);
