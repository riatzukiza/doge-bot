import Client from "snoowrap";
import cfg    from "./reddit.config.mjs";

let _client_config = null;
let _client        = null;

function init()
{
	if( !_client )
	{
		_client_config = {
			userAgent    : cfg.userAgent    ,
			clientId     : cfg.clientId     ,
			clientSecret : cfg.clientSecret ,
			refreshToken : cfg.refreshToken ,
		};
		if(
			cfg.userAgent   .length == 0 || cfg.clientId    .length == 0 || 
			cfg.clientSecret.length == 0 || cfg.refreshToken.length == 0
		){
			console.error( "invalid reddit configuration" );
			console.log( { reddit_config : _client_config } );
		}
		else
		{
			console.log( { reddit_config : _client_config } );
			_client = new Client( _client_config );
		}
	}
}

export default {
	init,
	get client() { return _client;        },
	get config() { return _client_config; }
};
