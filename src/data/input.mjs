import reddit       from "./reddit.input.mjs";
import twitter      from "./twitter.input.mjs";

const _sources = [ reddit, twitter ];
let   _index   = 0;

function init()
{
	for( let source of _sources )
		source.init();
}

function get_length()
{
	let tmp = 0;
	for( let source of _sources )
		tmp += source.length;
	return tmp;
}

async function poll( fn ) 
{
	let i      = 0;
	let source = null;
	
	while( (source = _sources[_index]).length == 0 && i++ < _sources.length )
		(_index = (_index + 1) % _sources.length);
	
	return source.poll( fn );
}

export default {
	init,
	poll,
	get length(){ return get_length(); }
	
};
