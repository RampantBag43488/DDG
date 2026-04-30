const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const alertasRoutes = require('./routes/alertas.routes');
const expedienteRoutes = require('./routes/expediente.routes');

const reportesRouter = require('./routes/reportes.routes.js');
const operacionesRouter = require('./routes/operaciones.routes.js')

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', alertasRoutes);
app.use('/', expedienteRoutes);

const { response } = require('express');

app.set("view engine", "ejs");
app.set("views","views");

app.use('/reportes', reportesRouter);
app.use('/operaciones', operacionesRouter)

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

const rutasOficial = require('./routes/oficial.routes');
app.use('/oficial', rutasOficial);

// Rutas Empleado

const rutasEmpleado = require('./routes/empleado.routes');
app.use('/empleado', rutasEmpleado);


app.listen(6767);