// const app = require("express")();
// const server = require("http").createServer(app);
// const cors = require("cors");

// const io = require("socket.io")(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// })

// app.use(cors());

// const PORT = process.env.PORT || 3500;

// app.get("/", (req, res) => {
//     res.send("Server is running");
// })

// io.on('connection', (socket) => {
//     socket.emit('me', socket.id);
//     socket.on('disconnect', () => {
//         socket.broadcast.emit("callended");
//     });
//     socket.on('calluser', ({ userToCall, signalData, from, name }) => {
//         io.to(userToCall).emit("calluser", { signal: signalData, from, name });
//     })
//     socket.on("answercall", (data) => {
//         io.to(data.to).emit("callaccepted", data.signal);
//     })
// });

// server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// server.js (debug-friendly)
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(cors());

const PORT = process.env.PORT || 3500;

app.get("/", (req, res) => {
    res.send("Server is running");
});

io.on("connection", (socket) => {
    // console.log("✅ New socket connection:", socket.id);

    // Emit the id to client
    socket.emit("me", socket.id);
    // Also log any custom events for debugging:
    socket.on("calluser", (payload) => {
        // console.log("calluser received", payload);
        io.to(payload.userToCall).emit("calluser", {
            signal: payload.signalData,
            from: payload.from,
            name: payload.name,
        });
    });
    socket.on("answercall", (data) => {
        // console.log("answercall", data);
        io.to(data.to).emit("callaccepted", data.signal);
    });

    socket.on("disconnect", (reason) => {
        // console.log("⚠️ socket disconnected:", socket.id, "reason:", reason);
        socket.broadcast.emit("callended");
    });
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
