require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const db = require("./DB/Connection");
const router = require("./Routes/otpRouter");
const crypto = require("crypto");
const secret_key = crypto.randomBytes(64).toString("hex");

const pServer = express();

// Configure CORS to allow requests from the specified origin and allow credentials
pServer.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

pServer.use(express.json());

// Configure session management with a secret key and other settings
pServer.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

pServer.use(router);

const PORT = 4000 || process.env.PORT;

pServer.listen(PORT, () => {
  console.log(`Server listening on port ` + PORT);
});

pServer.get("/", (req, res) => {
  res.send("Server is running");
});
