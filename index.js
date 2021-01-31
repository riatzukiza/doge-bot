require('dotenv').config();

var {create} = require('@kit-js/core/js/util');
const Twitter = require('twitter');
const ai = require('@kettlelogic/language-model');

var express = require('express');
var exphbs  = require('express-handlebars');
var request = require("request");
var qs = require("querystring");

var app = express();

//Declaring Express to use Handlerbars template engine with main.handlebars as
//the default layout
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var requestTokenUrl = "https://api.twitter.com/oauth/request_token";

var CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
var CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;

var oauth = {
    callback : "http://localhost:3000/signin-with-twitter",
    consumer_key  : CONSUMER_KEY,
    consumer_secret : CONSUMER_SECRET
};
var oauthToken = "";
var oauthTokenSecret = "";
app.get('/', function (req, res) {
    //Step-1 Obtaining a request token
    request.post({url : requestTokenUrl, oauth : oauth}, function (e, r, body){

        //Parsing the Query String containing the oauth_token and oauth_secret.
        var reqData = qs.parse(body);
        console.log({reqData})
        oauthToken = reqData.oauth_token;
        oauthTokenSecret = reqData.oauth_token_secret;

        //Step-2 Redirecting the user by creating a link
        //and allowing the user to click the link
        var uri = 'https://api.twitter.com/oauth/authenticate'
            + '?' + qs.stringify({oauth_token: oauthToken})
        res.render('home', {url : uri});
    });

});

//Callback to handle post authentication.
app.get("/signin-with-twitter", function(req, res){
    var authReqData = req.query;
    oauth.token = authReqData.oauth_token;
    oauth.token_secret = oauthTokenSecret;
    oauth.verifier = authReqData.oauth_verifier;

    var accessTokenUrl = "https://api.twitter.com/oauth/access_token";
    //Step-3 Converting the request token to an access token
    request.post({url : accessTokenUrl , oauth : oauth}, function(e, r, body){
        var authenticatedData = qs.parse(body);
        console.log(authenticatedData);

        //Make a request to get User's 10 latest tweets
        // var apiUrl = "https://api.twitter.com/1.1/statuses/user_timeline.json" + "?"
        //   + qs.stringify({screen_name: authenticatedData.screen_name, count: 10});

        var authenticationData = {
            consumer_key : CONSUMER_KEY,
            consumer_secret : CONSUMER_SECRET,
            access_token_key: authenticatedData.oauth_token,
            access_token_secret : authenticatedData.oauth_token_secret
        };

        console.log({authenticationData})

        const twitterClient = new Twitter(authenticationData);
        var m = create(ai.Model)();

        //event handlers
        /// casheing msg, 
        const ignore = [
            'fuck',
            'bitch',
            'shit',
            'sell',
            'coinbase',
            'upvote',
            'Daily Discussion',
            '[0-9: ]+pm',
            '[0-9: ]+am'
        ];

        let rg = new RegExp( ignore.join('|'), 'i' );

        twitterClient.get('search/tweets',{q:'doge'},(err,tweets) => {
            if(err) return console.error(err);


            console.log('initial tweets');
            for(let t of tweets.statuses) {
                console.log(t.text);
                train(t.text);
            }
        });
        function train(text) {
            if( !!text.length&& ! rg.test(text) )
            {
                m.train(2,text.split(/\W+/));
            }
        }

        const stream = twitterClient.stream('statuses/filter',{track:'doge'});

        stream.on('data',(event) => train(event.text))
            .on('error',error => console.error(error));

        setInterval(() => {

            const newTweet = `${m.generateRandomPhrase(20)}
#dogecoin
`;
            console.log('TWEET',newTweet);
            twitterClient.post('statuses/update',{
                status:newTweet
            },(error) => {
                if(error) {
                    console.error(error);
                }
            });
        },90000);// send a tweet every 90 seconds to avoid being rate limited

    });
});

app.listen(3000, function(){
    console.log('Server up: http://localhost:3000');
});
