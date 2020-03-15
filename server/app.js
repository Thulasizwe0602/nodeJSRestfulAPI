const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://sizwe:'+ process.env.MONGO_DB_PASSWORD +'@sizdb-4sjee.mongodb.net/soundHub?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        app.listen(5000);
        console.log("Server started at :", new Date().toString());
    })
    .catch(err => {
        console.log(err);
    });

const usersRoutes = require('./api/routes/users');
const permissionsRoutes = require('./api/routes/permissions');
const userTypeRoutes = require('./api/routes/usertypes');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", "PUT, POST, GET, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
})

//app routers
app.use('/users', usersRoutes);
app.use('/permissions', permissionsRoutes);
app.use('/usertypes', userTypeRoutes);

//Error handling.
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

module.exports = app;