import reddit from './reddit.client.mjs';
import ignore from './config.ignore.mjs';

let _last_seen_id   = 0;
let _last_poll_time = 0;
let _poll_interval  = 3600;
let _poll_cnt       = 10;
let _cache          = [];

let _rx_has_space = new RegExp( '^.* .*$' );
let _rx_ignore    = new RegExp( ignore.join( '|' ), 'i' );

function init()
{
  reddit.init();
  return !!reddit.client;
}

async function fetch()
{
  if( !reddit.client )
    return false;
    
  let id      = _last_seen_id;  
  let cnt_all = 0;
  let cnt_ok  = 0;
  let cnt_unq = 0;
  let posts   = new Map();
  
  const test = ( post )=> ((id = parseInt( post.id, 36 )) > _last_seen_id
    && !!post.title.length 
    && _rx_has_space.test( post.title )
    && !_rx_ignore.test( post.title )
  );
  const put  = post => { ++cnt_all; if( test( post ) ) ++cnt_ok, posts.set( post.id, post.title ); };
  const opts = { time: 'all', limit: _poll_cnt };
  
  let subreddit    = await reddit.client.getSubreddit( 'SatoshiStreetBets' );
    
  (await subreddit.getHot( opts )).forEach( post => put( post ) );
  (await subreddit.getTop( opts )).forEach( post => put( post ) );
  (await subreddit.getNew( opts )).forEach( post => put( post ) );
  
  posts.forEach( text => (++cnt_unq, _cache.push( text )) );
  _last_seen_id = id;
  
  console.log( `reddit fetch total: ${cnt_all} ok: ${cnt_ok} unique: ${cnt_unq}\n` );
  return true;
}

async function poll( fn ) 
{
  if( !reddit.client )
    return false;
    
  const t_now   = Date.now();
  const t_prev  = _last_poll_time;

  if( (t_now - t_prev) > _poll_interval ) 
  {
    await fetch();
    _last_poll_time = t_now;
  }
  
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
