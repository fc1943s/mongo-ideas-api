const faker = require('faker');
const { getObjectId } = require('mongo-seeding');
const users = require('../1-users/users');


const ideas = users.map(user => [...Array(3).keys()].map(_ => {
  const name = faker.commerce.productName();
  const description = faker.company.catchPhrase();

  return {
    _id: getObjectId(name),
    author: user._id,
    name,
    description,
  };
})).flat();

module.exports = ideas;
