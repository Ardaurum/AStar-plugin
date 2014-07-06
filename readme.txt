ACTIONS
SetTileSize(width, height) - You can either send and get index from all the other functions or using this function you can 
determine the size of tiles and send and get position from functions.
SetTileCost(x, y, cost) - Used to upload map to the plugin. Once uploaded it can be easily edited using this function so you can
create and delete tiles from it, but you must set the map before running any other function. Map can be of different sizes.
ClearMap() - Deletes the whole map.
CancelIfUnable(cancel) - If set to 1 then if the tile you are looking path to is unreachable then it won't return a path to it.
Otherwise you can get the path to the nearest tile. (Also if player clicks on the tile that you cannot walk on then it won't 
calculate path for it when "cancel" is set to 1).
FindPath(startX, startY, endX, endY) - finds path from position (startX, startY) to position (endX, endY).

EXPRESSIONS
GetPathXAt(ret, id) - returns x position of the id tile on the path. When running your character along the path you should increment id
every time you get to the next on the path.
GetPathYAt(ret, id) - returns y position.
GetPathLength(ret) - returns how many tiles are in the path.
GetError(ret) - returns string with error message. Errors messages are self-explanatory.