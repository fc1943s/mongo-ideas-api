const faker = require('faker');
const { getObjectId } = require('mongo-seeding');
const ideas = require('../2-ideas/ideas');


const workspaces = [
  ideas.slice(0, 2),
  ideas.slice(2, 4),
  ideas.slice(4, 6),
].map(ideas => {
  const name = faker.commerce.department();

  return {
    _id: getObjectId(name),
    name,
    ideas: ideas.map(x => x._id),
  };
}).flat();

module.exports = workspaces;
