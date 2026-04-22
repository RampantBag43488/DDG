const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const { response } = require('express');

app.set("view engine", "ejs");
app.set("views","views");

app.get("/health", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ status: "ok" });
    res.end();
});

app.get("/", (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.redirect('/login');
    res.end();
});

const rutasAuth = require('./routes/auth.routes');
app.use('/', rutasAuth);

app.get("/DashboardOC", (req, res) => {
    res.render('oc/Dashboard');
});

app.get("/DashboardEmpleado", (req, res) => {
    res.render('empleado/Dashboard');
});

app.listen(6767);