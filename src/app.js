const Twit = require('twit');
require('dotenv').config();

function tweet(msg) {
  let twitter = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SCRET,
    timeout_ms: 60 * 1000,
    strictSSL: true
  });

  twitter.post('statuses/update', {
    status: msg
  },
  function(err, data, res) {
    console.log(data);
  });
}

async function main() {
  tweet('Hello World!');
}

main();