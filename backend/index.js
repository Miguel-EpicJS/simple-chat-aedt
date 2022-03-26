require("dotenv").config();

if (process.env.NODE_ENV === "prod") {

    const http = require("http");

    const express = require("express");

    const app = express();

    app.get("/", (req, res) => {

        res.send({ on: true });

    })

    const server = http.createServer(app);

    const wss = require("./wss");

    wss(server);

    server.listen(process.env.PORT || 8080, () => {
        console.log(`Server started on port ${server.address().port} :) --- HEROKU`);
    });
} else {

    const fs = require("fs");
    const https = require("https");

    const express = require("express");

    const key = fs.readFileSync("./cert/server.key", "utf-8");
    const cert = fs.readFileSync("./cert/server.crt", "utf-8");

    const app = express();

    app.get("/", (req, res) => {

        res.send({ on: true });

    })

    const server = https.createServer( { key, cert },  app);

    const wss = require("./wss");

    wss(server);

    server.listen(process.env.PORT || 8080, () => {
        console.log(`Server started on port ${server.address().port} :) --- local https`);
    });
}