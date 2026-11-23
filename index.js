const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const socketIo = require("socket.io");
const config = require("./config");
const port = Number(process.env.PORT || 4000);
let router = require("./router");
var app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.NODE_ENV !== "production" ? process.env.LOCAL_FRONTEND_URL : null,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));

mongoose
  .connect(config.db)
  .then(() => console.log("Conection successful!"))
  .catch((err) => console.error(err));

app.get("/health", (req, res) => res.json({ ok: true }));

const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

io.on("connection", (socket) => {
  console.log("Socket, new connection", socket.id);
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    socket.disconnect();
  });
});

app.use(router.init(io));
app.use("/images", express.static(path.join(__dirname, "images")));

server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});