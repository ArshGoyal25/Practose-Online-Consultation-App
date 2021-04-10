const { validateToken } = require('../../middleware/auth');
const User = require('../../models/User');
const Chat = require('../../models/Chat');

const chat = (io, chatUsers) => {
    console.log('Chat system connected');

    io.on('connection', (socket) => {
        console.log(`${socket.id} connected`);

        socket.on('initialize', async (data, callback) => {
            // Add user object to chatUsers
            console.log("ID: ", data.id);
            const user = await User.findById(data.id);
            if(!user) return callback({ success: false, message: 'Invalid ID'});
            user.socketId = socket.id;
            chatUsers[data.id] = user;
        })


        socket.on('newMessage', async (data, callback) => {
            const user = await validateToken(data.token);
            if(!user) return callback({ success: false, message: 'Invalid token'});
            const isFirstMessage = !(data.recipient in user.chat); // First message between the two participants
            const messageObj = {
                from: user._id,
                to: data.recipient,
                message: data.message,
                timestamp: new Date()
            }
            if(data.recipient in chatUsers) io.to(chatUsers[data.recipient].socketId).emit(messageObj);
            if(isFirstMessage) {
                const newChat = new Chat({
                    messages: [messageObj],
                })
                await newChat.save();
                // Update chat field in sender
                user.messages.set(recipient, newChat.id);
                // Update chat field in recipient           
                const recipientUser = await User.findById(data.recipient);
                recipientUser.chat.set(user._id, newChat.id);
                // Update both recipient and sender in db
                await user.save();
                await recipientUser.save();
                
                if(recipient in chatUsers)
                    chatUsers[data.recipient] = {...recipientUser, socketId: chatUsers[data.recipient].socketId};
                chatUsers[user._id] = {...user, socketId: chatUsers[user._id].socketId };
            } else {
                const chatDoc = await Chat.findById(user.chat.get(data.recipient));
                chatDoc.messages.push(messageObj);
                await chatDoc.save();
            }
        })
    })
}   


module.exports = chat;