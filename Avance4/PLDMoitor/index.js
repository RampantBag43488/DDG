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

app.get('/login', (req, res) => {
    res.render('auth/login/Login');
});

// Rutas Oficial de Cumplimiento

app.get("/DashboardOC", (req, res) => {
    res.render('oc/dashboard/Dashboard');
});

app.get("/Alertas", (req, res) => {
    res.render('oc/alertas/Alertas');
});

app.get("/Operaciones", (req, res) => {
    res.render('oc/operaciones/Operaciones');
});

app.get("/Expediente", (req, res) => {
    res.render('oc/expediente/Expediente');
});

app.get("/Reportes", (req, res) => {
    res.render('oc/reportes/Reportes');
});

// Rutas Empleado

app.get("/DashboardEmpleado", (req, res) => {
    res.render('empleado/dashboard/Dashboard');
});


app.listen(6767);