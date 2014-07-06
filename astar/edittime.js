function GetPluginSettings()
{
	return {
		"name":			"AStar",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"BMDAStar",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"AStar algorithm for finding paths in tiled map",
		"author":		"Radosław Paszkowski",
		"category":		"General",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"flags":		0						// uncomment lines to enable flags...
	};
};

////////////////////////////////////////
// Conditions

////////////////////////////////////////
// Actions

AddNumberParam("width", "Tile width");
AddNumberParam("height", "Tile height");
AddAction(0, af_none, "Set tile size", "Tiles", "Set Tile Size to ({0},{1})", "Set tile size", "SetTileSize");

AddNumberParam("x", "Column index in tile map");
AddNumberParam("y", "Row index in tile map");
AddNumberParam("cost", "Cost of the tile. -1 cost means that you can't walk on this tile.");
AddAction(1, af_none, "Set cost of tile", "Tiles", "Set Cost of the <b>({0},{1})</b> tile to {2}", "Set cost of the tile", "SetTileCost");

AddNumberParam("startX", "Starting x position");
AddNumberParam("startY", "Starting y position");
AddNumberParam("endX", "Ending x position");
AddNumberParam("endY", "Ending y position");
AddAction(2, af_none, "Find path", "Tiles", "Find path from ({0},{1}) to ({2},{3})", "Find path", "FindPath");

AddAction(3, af_none, "Clear map", "Tiles", "Clear map", "Clears the map", "ClearMap");

AddNumberParam("cancel", "Set to 1 if you don't want to receive path if target is unreachable");
AddAction(4, af_none, "Cancel if unable", "Tiles", "If set to 0 then returns path when target is unreachable", "If set to 0 then returns path when target is unreachable", "CancelIfUnable");

////////////////////////////////////////
// Expressions
AddNumberParam("id", "Index of tile in path");
AddExpression(0, ef_return_number, "Get path x", "Path", "GetPathXAt", "Return column index of tile in the path");

AddNumberParam("id", "Index of tile in path");
AddExpression(1, ef_return_number, "Get path y", "Path", "GetPathYAt", "Return row index of tile in the path");

AddExpression(2, ef_return_number, "Get path length", "Path", "GetPathLength", "Return length of path (how many tiles are in the path)");

AddExpression(3, ef_return_string, "Get error", "Path", "GetError", "Return error if something went wrong");

////////////////////////////////////////
ACESDone();

var property_list = [

	];
	
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	this.instance = instance;
	this.type = type;
	
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}

IDEInstance.prototype.OnInserted = function()
{
}

IDEInstance.prototype.OnDoubleClicked = function()
{
}

IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

IDEInstance.prototype.Draw = function(renderer)
{
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}