// Require
const express = require("express");
const fs = require("fs");
const path = require("path");

// Config
const db = require("./config/db.js");

// Objects
const app = express();
const conn = db.init();

// Route js files
const index = require("./routes/index.js");
const storage = require("./routes/storage.js")(conn);

// Constants
const PORT = 7006;

// View engine
app.set("view engine", "ejs");
app.set("views", "./ejs");

// Middleware
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", index);
app.use("/storage", storage);

// 404 Not found page
app.use((req, res) => {
    fs.readFile(path.join(__dirname, "/public/pages/404.html"), (error, data) => {
        if (error) {
            console.log(error);
            res.status(500);
            res.end("Server Error");

            return;
        }

        res.status(404);
        res.end(data);
    });
});

db.connect(conn);

app.listen(PORT, () => {
    console.log(`Server start on ${PORT} port! http://localhost:${PORT}`);
});