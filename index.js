const express = require('express');
const helmet = require('helmet');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const Router = require('./Router/Router');

app.use(helmet())
app.use('./middleware', express.static("./middleware"))
app.use(express.json())
app.use(cors())

const logRequests = (req, res, next) => {
    let request = req.connection.remoteAddress;
    console.log('request from: '+request)
    next()
}

app.use(logRequests)
app.use(Router)




app.listen(process.env.PORT, () => {
    console.log( 'listening on port ' + process.env.PORT )
})