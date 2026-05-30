require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./util/database');

app.set("trust proxy", 1);

app.use(helmet());
app.use(cookieParser());
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'sesion'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 8 // 8 horas
    }
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

if (require.main === module) {
    app.listen(6767);
}

module.exports = app;
