import express from 'express';
import path from 'path';
import { Server } from 'socket.io';

const app = express();
const port = process.env.PORT || 3000;

app.use('', express.static(path.join(__dirname, '..', 'public')));

app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'home.html'));
});

app.get('/chat/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'chat.html'));
});

const server = app.listen(port, () => {
    console.log(`Api is running in port ${port}`);
});

const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Se conectó un cliente');

    socket.on('joinRoom', (roomId) => {
        socket.join('room-' + roomId)
    });

    socket.on('sendNewMessage', (data) => {
        console.log('Recibiste un mensaje: ', data);
        //socket.broadcast.emit('messageReceived', data); //a todos menos a mi
        socket.to('room-' + data.room).emit('messageReceived',data);
    });

    socket.on('sendNewNotification', (data) => {
        console.log('Recibiste un mensaje: ', data);
        //socket.broadcast.emit('messageReceived', data); //a todos menos a mi
        socket.to('room-' + data.room).emit('notificationReceived',data);
    });

    
});