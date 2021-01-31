import path    from "path";
import process from "process";
import dotenv  from "dotenv";

dotenv.config( { path: path.join( process.cwd(), '.env' ) } );

export default {
	userAgent    : process.env.REDDIT_USER_AGENT    ,
	clientId     : process.env.REDDIT_CLIENT_ID     ,
	clientSecret : process.env.REDDIT_CLIENT_SECRET ,
	refreshToken : process.env.REDDIT_REFRESH_TOKEN ,
	accessToken  : process.env.REDDIT_ACCESS_TOKEN  ,
};
