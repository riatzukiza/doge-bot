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
console.log(twitterConfig)
const twitterClient = new Twitter(twitterConfig)
//duck needs to "say"

//procedeures

function say (something){}
function receive (msg){}
function interperet (msg){}
function think(){}
//pull from corpus to generate response    
function respond(stuff){}

//variables

// const client = new Discord.Client();
var m = create(ai.Model)();

//event handlers
/// casheing msg, 
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

const lim = 10;
let i = 0;

stream.on('data',(event) => train(event.text))

setInterval(() => {

    const newTweet = `${m.generateRandomPhrase(20)}
#dogecoin
`
    console.log("TWEET",newTweet)
    twitterClient.post("statuses/update",{
        status:newTweet
    },(error,tweet,response) => {
        if(error) {
            console.error(error);
        }
    })
},90000);// send a tweet every 90 seconds to avoid being rate limited

// client.on('ready', async() => {
//     console.log(`Logged in as ${client.user.tag}!`);
//     async function readCorpusFromFile(filename){
//         const shakespere = await fs.readFile(filename ,'utf8')
//         m.train(2,shakespere.split(/\W+/)) 
//     }
//     async function readCorpusFromFiles(fileNames){
//         for(let name of fileNames) {
//             await readCorpusFromFile(name);
//         }
//     }
//     await readCorpusFromFiles(['shakespere.txt', 'hacker-howto.txt'])
//     console.log('done reading corpus files')

// });
// client.on('message', async msg => {
//     console.log(msg.author.tag, ':', msg.channel.name, ':', msg.channel.guild.name, ':',msg.content)
//     m.train(2,msg.content.split(/\W+/))
//     if(msg.author.tag !== "Duck#4445")
//     {
//         msg.reply(m.generateRandomPhrase(20))
//     }
// });
// client.login(process.env.DISCORD_API_KEY);
// /// add function async , remove calls read Corpus From file, add singular call to the  function corpus

