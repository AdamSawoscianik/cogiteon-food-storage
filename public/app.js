const { SerialPort } = require('serialport');
const http = require('http');
const server = http.createServer();
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const serialPort = new SerialPort({
  path: '/dev/ttyS0', // /dev/ttyS0 for linux COM1 fro windows
  baudRate: 115200,
}).setEncoding('utf8');

const connectSerialPort = () => {
  serialPort.on('open', (err) => {
    if (err) {
      return console.log('Error opening Serial Port: ', err.message);
    }
    return console.log('Serial Port opened correctly');
  });
};

io.on('connection', (socket) => {
  console.log(`socket connected ${socket.id}`);
  connectSerialPort();

  // socket.on('test', (data) => socket.emit('data', data));

  serialPort.on('error', (err) => {
    return console.log('Error getting data: ', err.message);
  });

  serialPort.on('data', (data) => {
    socket.emit('data', data);
    console.log(`data received: ${data}`);
  });
});

server.listen(5000, () => {
  console.log('listening on *:5000');
});
