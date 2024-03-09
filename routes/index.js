const router = require("express").Router();
const fs = require("fs");
const path = require("path");

router.get("/", (req, res) => {
    fs.readFile(path.join(__dirname, "../public/pages/index.html"), (error, data) => {
        if (error) {
            console.log(error);
            res.status(500);
            res.end("Server Error");

            return;
        }

        res.status(200);
        res.end(data);
    });
});

module.exports = router;