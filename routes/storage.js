const router = require("express").Router();
const fs = require("fs");
const path = require("path");

module.exports = (conn) => {
    router.get("/", (req, res) => {
        const sql = "SELECT name FROM storage;";

        conn.query(sql, (error, rows, fields) => {
            if (error) {
                console.log(error);
                res.status(500);
                res.end("Server Error");

                return;
            }

            res.status(200);
            res.render(path.join(__dirname, "../ejs/storage.ejs"), { list: rows });
        });
    });

    router.post("/", (req, res) => {
        // Check name is empty
        if (!req.body.name) {
            res.status(200);
            res.end("Name is empty");

            return;
        }

        // Exit function if name exists
        const sql = `SELECT EXISTS(SELECT name FROM storage WHERE name = "${req.body.name}" LIMIT 1) AS success;`;

        conn.query(sql, (error, rows, fields) => {
            if (error) {
                console.log(error);
                res.status(500);
                res.end("Server Error");

                return;
            }

            if (rows[0].success === 1) {
                fs.readFile(path.join(__dirname, "../public/pages/existStorage.html"), (error, data) => {
                    if (error) {
                        console.log(error);
                        res.status(500);
                        res.end("Server Error");
            
                        return;
                    }
            
                    res.status(200);
                    res.end(data);
                });

                return;
            }
            
            // Insert data
            const sql = `INSERT INTO storage(name) VALUES("${req.body.name}");`;
            
            conn.query(sql, (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    res.status(500);
                    res.end("Server Error");

                    return;
                }
                
                res.setHeader("Content-Type", "text/html");
                res.status(200);
                res.end(`<link href="/css/gotopage.css" rel="stylesheet" type="text/css"><a class="goto" href="/storage">Go to storage</a>`);
            });
        });
    });

    router.get("/:name", (req, res) => {
        let name = req.params.name;
        let sql = `SELECT EXISTS(SELECT name FROM storage WHERE name = "${name}" LIMIT 1) AS success;`;
        
        conn.query(sql, (error, rows, fields) => {
            if (error) {
                console.log(error);
                res.status(500);
                res.end("Server Error");

                return;
            }

            if (rows[0].success === 1) {
                const sql = `SELECT id FROM storage WHERE name = "${name}";`;

                conn.query(sql, (error, rows, fields) => {
                    if (error) {
                        console.log(error);
                        res.status(500);
                        res.end("Server Error");

                        return;
                    }

                    res.status(200);
                    res.render(path.join(__dirname, "../ejs/storageDetail.ejs"), { id: rows[0].id, name: name });
                });
            }
        });
    });

    return router;
}