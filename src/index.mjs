import { promises as fs } from 'fs';
import input  from './data/input.mjs';

async function main()
{
  input.init();
  let dst = await fs.open( 'title.data', 'w' );
  while( await input.poll( text => dst.write( `${text}\n` ) ) );
  dst.close();
}

main();
