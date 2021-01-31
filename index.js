//imports
require('dotenv').config()
// const fs = require("fs").promises
var {create} = require("@kit-js/core/js/util");
const Twitter = require("twitter")
// const Discord = require('discord.js');
const ai = require('@kettlelogic/language-model');
const { readFile } = require('fs');


const twitterConfig = {
    consumer_key:process.env.TWITTER_CONSUMER_KEY,
    consumer_secret:process.env.TWITTER_CONSUMER_SECRET,
    access_token_key:process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret:process.env.TWITTER_ACCESS_TOKEN_SECRET,
}

const twitterClient = new Twitter(twitterConfig)
//duck needs to "say"

var m = create(ai.Model)();

const ignore = [
    "fuck",
    "bitch",
    "shit",
    "sell",
    "coinbase",
    "upvote",
    "Daily Discussion",
    "[0-9: ]+pm",
    "[0-9: ]+am"
];

let rg = new RegExp( ignore.join('|'), 'i' );

twitterClient.get('search/tweets',{q:"doge"},(err,tweets,response) => {
    if(err) return console.error(err);


    console.log("initial tweets")
    for(let t of tweets.statuses) {
        console.log(t.text)
        train(t.text)
    }
})
function train(text) {
    if( !!text.length&& ! rg.test(text) )
    {
        m.train(2,text.split(/\W+/));
    }
}

const stream = twitterClient.stream('statuses/filter',{track:'doge'});

stream.on('data',(event) => train(event.text))
.on('error',err => console.error(err))

setInterval(() => {

    const newTweet = `${m.generateRandomPhrase(20)}
#dogecoin #dogecointoadollar
`
    console.log("TWEET",newTweet)
    twitterClient.post("statuses/update",{
        status:newTweet
    },(error,tweet,response) => {
        if(error) {
            console.error(error);
        }
    })
},120000);
