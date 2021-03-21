const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const { readdirSync } = require('fs')
require('dotenv').config()

// App
const app = express()

// DB
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to DB');
    })
    .catch(error => {
        console.log(error);
    })

// Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '2mb' }))
app.use(cors())

// Routes middleware
readdirSync('./routes').map((r) =>
    app.use("/api", require(`./routes/${r}`))
)

// Port
const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log('Server is running');
})
