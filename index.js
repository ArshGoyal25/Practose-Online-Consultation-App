const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');
const connectToDB = require('./server/db');
const chat = require('./server/routes/socket/chat');
const path = require('path');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
}
else {
    app.use(express.static(path.join(__dirname, 'client/public')));
}

const chatUsers = {}; // userId: userObject (with socket_id)
app.use(cors());
app.use(express.json());

app.use('/api/user', require('./server/routes/user'));
app.use('/api/appointment', require('./server/routes/appointment'));

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

connectToDB();

chat(io, chatUsers);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})