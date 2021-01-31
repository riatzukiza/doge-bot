import Client from 'twitter';
import cfg    from './twitter.config.mjs';

let _client_config = null;
let _client        = null;

function init()
{
  if( !_client )
  {
    _client_config = {
      consumer_key        : cfg.consumer_key        ,
      consumer_secret     : cfg.consumer_secret     ,
      access_token_key    : cfg.access_token_key    ,
      access_token_secret : cfg.access_token_secret ,
    };
    if( 
      cfg.consumer_key    .length == 0 || cfg.consumer_secret    .length == 0 ||
      cfg.access_token_key.length == 0 || cfg.access_token_secret.length == 0
    ){
      console.error( 'invalid twitter configuration' );
      console.log( { twitter_config : _client_config } );
    }
    else 
    {
      console.log( { twitter_config : _client_config } );
      _client = new Client( _client_config );
    }
  }
}

export default {
  init,
  get client() { return _client;        },
  get config() { return _client_config; }
};
