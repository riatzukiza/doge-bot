import twitter from "./twitter.client.mjs";
import ignore from "./config.ignore.mjs";

let _cache  = [];
let _stream = null;

let _rx_has_space = new RegExp( "^.* .*$" );
let _rx_ignore    = new RegExp( ignore.join('|'), 'i' );

function init()
{
	twitter.init();
	
	if( !twitter.client )
		return false;
	
	twitter.client.get( 'search/tweets', { q: "doge" }, ( err, tweets, response ) => 
	{
    if( err ) 
			return console.error( err );
    for( let tweet of tweets.statuses ) 
			_cache.push( tweet.text );
	} );
	
	_stream = twitter.client.stream( 'statuses/filter', { track: 'doge' } );
	_stream.on( 'data', event => _cache.push( event.text ) );
	
	return true;
}

async function poll( fn ) 
{
	if( !twitter.client )
		return false;
		
	if( _cache.length > 0 && fn )
	{
		fn( _cache[_cache.length - 1] );
		_cache.pop();
		return true;
	}
	return false;
}

export default {
	init,
	poll,
	get length(){ return _cache.length; }
};
