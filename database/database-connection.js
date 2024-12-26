const { connect, connection } = require('mongoose');

const connectToDatabase = async () => {
  try {
    await connect('mongodb://localhost:27017/corporate');
  } catch (err) {
    console.error('[-] database connection >', err);
    console.info('[i] process terminated.');
    process.exit(1);
  }
};

connection.once('connected', () => {
  console.log('[+] database connected.');
});

connection.on('disconnected', () => {
  console.info('[i] database disconnected.');
});

connection.on('reconnected', () => {
  console.log('[+] database reconnected.');
});

connection.on('error', (err) => {
  console.error('[-] database error >', err);
});

module.exports = { connectToDatabase };
