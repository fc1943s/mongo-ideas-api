const path = require('path');
const seeding = require('mongo-seeding');
const mongoose = require('mongoose');

require('./model/user');
require('./model/idea');
require('./model/workspace');


const dbConfig = {
  protocol: 'mongodb',
  host: process.env.MONGODB_HOST || 'localhost',
  port: 27017,
  name: 'ideas',
};

const connectionString = `${dbConfig.protocol}://${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;

async function seedData() {
  await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
  console.log('MongoDB connected');

  const collections = await mongoose.connection.db.listCollections().toArray();
  if (collections.length === 0) {
    const seeder = new seeding.Seeder({database: dbConfig});
    await seeder.import(seeder.readCollectionsFromPath(path.resolve('./data')));
    console.log('Database initialized with fake data');
  }
}

module.exports.seedData = seedData;
