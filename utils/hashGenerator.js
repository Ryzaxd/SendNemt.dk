const crypto = require('crypto');

function generateHash() {
  const uniqueIdentifier = crypto.randomBytes(8).toString('hex');

  const currentTimestamp = new Date().getTime().toString();
  const randomValue = Math.random().toString();

  const hash = crypto.createHash('md5')
    .update(uniqueIdentifier + currentTimestamp + randomValue)
    .digest('hex');

  return hash;
}

module.exports = generateHash;