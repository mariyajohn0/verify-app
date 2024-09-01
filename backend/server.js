require('dotenv').config()

const express = require('express')
const session = require('express-session');
const cors = require('cors')
const db = require('./DB/Connection')
const router = require('./Routes/otpRouter');
const crypto = require('crypto');
const secret_key = crypto.randomBytes(64).toString('hex');

const pServer = express()

pServer.use(cors({
    origin: 'http://localhost:3000', // Replace with your Next.js origin in production
    credentials: true // Allow credentials (cookies) to be sent
}));

pServer.use(express.json())

pServer.use(session({
    secret: 'secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));

pServer.use(router)

const PORT = 4000 || process.env.PORT

pServer.listen(PORT,() => {
    console.log(`PServer listening on port `+PORT);
})

pServer.get('/',(req,res) => {
    res.send('Server is running')
})


