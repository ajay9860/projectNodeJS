const express = require('express')
//const colors = express('colors')
const app = express()
const morgan = require('morgan')
const dotenv = require('dotenv');
const mySqlPool = require('./config/db');
const cors = require('cors');

app.use('/uploads', express.static('uploads'));
const corsOptions = {
    origin: 'http://localhost:8002', // Allow only requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'], // Allow these headers
    credentials: true, // Allow cookies to be sent
  };
// config dotenv

dotenv.config();

// rest object



// middlewares
app.use(express.json())

app.use(morgan("dev"));

// routes

app.use(cors(corsOptions));

app.use('/api/v1/myproject', require('./routes/userRoutes'));

app.get('/test', (req,res) => {
    res.status(200).send('<h1>1aaamy sqy</h1>')
})


// sport

const port = process.env.port || 8000

mySqlPool.query('SELECT 1').then(() => {

    console.log('Database connected')

    // listen
    app.listen(port, () => {
        console.log(`server listen on port ${process.env.port}`)
    })
}).catch((error) => {
    console.log(error);
})
