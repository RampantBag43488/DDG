require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
 

app.use(helmet());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");
app.set("views", "views");

const loginRoutes = require('./routes/auth.routes.js');
app.use('/', loginRoutes); 

const alertasRoutes = require('./routes/alertas.routes');
const expedienteRoutes = require('./routes/expediente.routes');
const reportesRouter = require('./routes/reportes.routes.js');
const operacionesRouter = require('./routes/operaciones.routes.js');
const rutasOficial = require('./routes/oficial.routes');
const rutasEmpleado = require('./routes/empleado.routes');
const rutasAdmin = require('./routes/admin.routes');

app.use('/', alertasRoutes);
app.use('/', expedienteRoutes);
app.use('/reportes', reportesRouter);
app.use('/operaciones', operacionesRouter);
app.use('/oficial', rutasOficial);
app.use('/empleado', rutasEmpleado);
app.use('/admin', rutasAdmin);

app.get("/", (req, res) => {
    res.redirect('/login');
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});


app.listen(6767);