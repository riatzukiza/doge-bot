
const cfg    = JSON.parse( await fs.readFile( "../cfg/cfg.src.SRC_NAME.json", "utf8" ) ); // edit
const ignore = JSON.parse( await fs.readFile( "../cfg/cfg.src.ignore.json"  , "utf8" ) );
