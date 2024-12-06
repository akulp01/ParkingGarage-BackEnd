const http = require('http');
const cors = require('cors');
const server = http.createServer();

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });

    socket.on('message', (data) => {
        console.log(`Received message: ${data}`);
    });
});

server.listen(3023, () => {
    console.log('Server is running on port 3023');
});

function sendToAllClients(event, data) {
    io.emit(event, data);
}

module.exports = { sendToAllClients };