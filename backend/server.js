require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const db = require("./DB/Connection");
const router = require("./Routes/otpRouter");
const crypto = require("crypto");
const secret_key = crypto.randomBytes(64).toString("hex");

const server = express();

// Configure CORS to allow requests from the specified origin and allow credentials
server.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

server.use(express.json());

// Configure session management with a secret key and other settings
server.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

server.use(router);

const PORT = 4000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server listening on port ` + PORT);
});

server.get("/", (req, res) => {
  res.send("Server is running");
});
