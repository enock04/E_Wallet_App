const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

async function connectToMongoDB() {
  try {
    // Start in-memory MongoDB server
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    console.log('In-memory MongoDB server started at:', mongoUri);

    // Connect to the in-memory database
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully!');

    // Keep connection open for testing
    console.log('Connection is open. Press Ctrl+C to close.');

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\nClosing MongoDB connection...');
      await mongoose.connection.close();
      await mongoServer.stop();
      console.log('MongoDB connection closed.');
      process.exit(0);
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

connectToMongoDB();
