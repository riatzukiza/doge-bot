import path    from "path";
import process from "process";
import dotenv  from "dotenv";

dotenv.config( { path: path.join( process.cwd(), '.env' ) } );

export default {
	consumer_key			  : process.env.TWITTER_CONSUMER_KEY        ,
	consumer_secret		  : process.env.TWITTER_CONSUMER_SECRET     ,
	access_token_key	  : process.env.TWITTER_ACCESS_TOKEN_KEY    ,
	access_token_secret : process.env.TWITTER_ACCESS_TOKEN_SECRET ,
};
