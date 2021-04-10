const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');
const connectToDB = require('./db');
const chat = require('./routes/socket/chat');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

const chatUsers = {}; // userId: userObject (with socket_id)
app.use(cors());
app.use(express.json());

app.use('/api/user', require('./routes/user'));
app.use('/api/appointment', require('./routes/appointment'));

connectToDB();

chat(io, chatUsers);

const PORT = 8000 || process.env.port;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})