import express from "express";
import http from "http";
import compression from "compression";
import "dotenv/config";
import path from "node:path";

import { server as wisp } from "@mercuryworkshop/wisp-js/server";

const port = parseInt(process.env.PORT || "2100");
const app = express();
const root = process.cwd();
const publicPath = path.join(root, "public");

const scramjetPath = path.join(root, "node_modules/@mercuryworkshop/scramjet/dist");
const controllerPath = path.join(root, "node_modules/@mercuryworkshop/scramjet-controller/dist");
const utilsPath = path.join(root, "node_modules/@mercuryworkshop/scramjet-utils/dist");
const epoxyPath = path.join(root, "node_modules/@mercuryworkshop/epoxy-transport/dist");

app.use(compression());
app.use(express.json());

app.use("/scram", express.static(scramjetPath));
app.use("/controller", express.static(controllerPath));
app.use("/utils", express.static(utilsPath));
app.use("/epoxy", express.static(epoxyPath));
app.use(express.static(publicPath));

app.get("/go=:query", async (req, res) => {
    try {
        const reply = await fetch(
            `http://api.duckduckgo.com/ac/?q=${encodeURIComponent(req.params.query)}&format=json`
        );
        res.json(await reply.json());
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        res.status(500).json({ error: "Failed to fetch suggestions" });
    }
});

app.get("/", (req, res) => res.sendFile(path.join(publicPath, "index.html")));
app.get("/index", (req, res) => res.sendFile(path.join(publicPath, "index2.html")));
app.get("/g", (req, res) => res.sendFile(path.join(publicPath, "g.html")));
app.get("/s", (req, res) => res.sendFile(path.join(publicPath, "s.html")));
app.get("/a", (req, res) => res.sendFile(path.join(publicPath, "a.html")));
app.get("/null", (req, res) => res.sendFile(path.join(publicPath, "start.html")));
app.get("/portfolio", (req, res) => res.sendFile(path.join(publicPath, "yesbro.html")));

app.use((req, res) => res.status(404).send("404"));

const server = http.createServer(app);

server.on("upgrade", (req, socket, head) => {
    if (req.url?.startsWith("/wisp/")) {
        wisp.routeRequest(req, socket, head);
        return;
    }

    socket.end();
});

server.on("listening", () => {
    console.log(`Server running on port ${port}`);
    console.log(`Wisp running on ws://localhost:${port}/wisp/`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    console.log("Closing server...");
    server.close();
    process.exit(0);
}

server.listen({ port });