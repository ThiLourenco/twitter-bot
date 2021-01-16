const Twit = require('twit');
const Cron = require('node-cron');
const puppeteer = require('puppeteer');
require('dotenv').config();

function tweet(msg) {
  let twitter = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
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

async function getRecoveredNumber() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1024,
    height: 768
  });

  await page.goto('https://covid.saude.gov.br/', {
    timeout: 60*1000,
    waitUntil: 'networkidle2'
  });

  let recovered = await page.evaluate(() => {
    let numberPage = document.getElementsByClassName('lb-total')[0].lastChild.data.trim();
    return numberPage
  });

  await browser.close();
  return recovered;
}

async function main() {
  let recovered = await getRecoveredNumber();
  let doTweet = 'Bom dia!\n';
  doTweet += '\n';
  doTweet += recovered + 'brasileiros se recuperaram da covid #Covid19 até o momento \n '
  doTweet += '\n';
  doTweet += 'Fonte: https://covid.saude.gov.br';
  tweet(doTweet);
}

Cron.schedule('30 6 * * *', () => {
  main();
});