const { getObjectId } = require('mongo-seeding');
const auth = require('../../auth');


const defaultPassword = auth.hashPassword('123456');

const users = [
  {
    _id: getObjectId('Sam McDermott'),
    name: 'Sam McDermott',
    email: 'ceo@company.com',
    password: defaultPassword,
  },
  {
    _id: getObjectId('Layla Erdman'),
    name: 'Layla Erdman',
    email: 'cto@company.com',
    password: defaultPassword,
  },
];

module.exports = users;
