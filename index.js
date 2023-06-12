require('dotenv').config();
const routes = require('./routes/routes');
const cors = require('cors');

const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const cron = require('node-cron');
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use('/api', routes);
app.use(cors());
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('chat message', (message) => {
    console.log('Received chat message:', message);

    // Broadcast the message to all connected clients
    io.emit('chat message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Handle client disconnection event
  });
});
async function cleanupDatabase() {
  try {
    // Get all the collection names in the database
    const collections = mongoose.connection.collections;

    // Iterate over each collection and delete all documents
    for (const collectionName in collections) {
      const collection = collections[collectionName];
      await collection.deleteMany({});
      console.log(`Deleted all documents from collection: ${collectionName}`);
    }

    console.log('Database cleanup completed');
  } catch (error) {
    console.error('Error cleaning up database:', error);
  }
}
cron.schedule('0 1 * * *', () => {
  console.log('Running database cleanup task...');
  cleanupDatabase();
});
const port = 8000;
server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});