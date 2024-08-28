import fs from 'fs';
import path from 'path';
import { SerialPort } from 'serialport';
import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer();

const socket = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const serialPort = new SerialPort({
  path: '/dev/ttyS0', // /dev/ttyS0 for linux COM1 fro windows
  baudRate: 115200,
}).setEncoding('utf8');

const log = (message) => {
  const logFilePath = path.join(__dirname, 'app-logs.log');
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write error to file:', err);
    }
  });
};

const connectToSerialPort = () => {
  serialPort.on('open', (err) => {
    if (err) {
      log(`Error - could not connect to serialport, message: ${err.message}`);
    }
    log('Success - connected to serialport');
  });
};

socket.on('connection', (socket) => {
  log(`Success - socket connected ${socket.id}`);
  connectToSerialPort();

  // socket.on('test', (data) => socket.emit('data', data));

  serialPort.on('error', (err) => {
    log(`Error - error from serialPort: ${err}`);
  });

  serialPort.on('data', (data) => {
    log(`Success - data from serialPort: ${data}`);
    socket.emit('data', data);
  });
});

server
  .listen(5000, () => {
    console.log('listening on *:5000');
    log('Success - Server started successfully on port 5000');
  })
  .on('error', (err) => {
    console.error('Failed to start server:', err);
    log(`Error - Failed to start server: ${err.message}`);
  });
