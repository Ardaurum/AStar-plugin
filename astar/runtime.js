// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.BMDAStar = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.BMDAStar.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function()
	{
		this.tileCosts = new Array();
		this.path = new Array();
		this.width = 0;
		this.height = 0;
		this.maxX = 0;
		this.maxY = 0;
		this.error = "";
		this.cancel = 1;
		
		this.indexOfPoint = function(arr, point) 
		{
			for (var i = 0; i < arr.length; i++)
			{
				if ((arr[i].x == point.x) && (arr[i].y == point.y))
					return i;
			}
			return -1;
		};
	};
	
	instanceProto.onDestroy = function ()
	{
	};
	
	instanceProto.saveToJSON = function ()
	{
		return {

		};
	};
	
	instanceProto.loadFromJSON = function (o)
	{

	};
	
	instanceProto.draw = function(ctx)
	{
	};
	
	instanceProto.drawGL = function (glw)
	{
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": "My debugger section",
			"properties": [

			]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.SetTileSize = function(width, height)
	{
		this.width = width;
		this.height = height;
	};

	Acts.prototype.SetTileCost = function(x, y, cost)
	{
		if (x < 0 || y < 0) 
		{
			this.error = "Cannot create tile with negative index";
			return;
		}
		if (this.maxX <= x)
		{
			for (var i = this.maxX; i <= x; i++)
			{
				this.tileCosts[i] = new Array();
			}
			this.maxX = x + 1;
		}
		
		if (this.maxY <= y)
		{
			this.maxY = y;
		}
		
		this.tileCosts[x][y] = cost;
	};
	
	Acts.prototype.FindPath = function(startX, startY, endX, endY)
	{
		this.path = new Array();
		if (this.width > 0 && this.height > 0)
		{
			startX = Math.floor(startX / this.width);
			startY = Math.floor(startY / this.height);
			endX = Math.floor(endX / this.width);
			endY = Math.floor(endY / this.height);
		}
		
		if ((startX == endX) && (startY == endY))
		{
			this.error = "Cannot get path where starting point is the same as target!";
			return;
		}
		
		if ((startX < 0) || (startX >= this.maxX) || (startY < 0) || (startY >= this.maxY))
		{
			this.error = "Starting point out of bounds!";
			return;
		}
		
		if ((endX < 0) || (endX >= this.maxX) || (endY < 0) || (endY >= this.maxY))
		{
			this.error = "Target out of bounds!";
			return;
		}
		
		if ((this.tileCosts[endX][endY]) && (this.cancel == 1))
		{
			this.error = "Cannot move to the target on which you can't walk!";
			return;
		}
		
		var found = 0;
		
		var openList = new Array();
		var closedList = new Array();
		
		var parent = new Array();
		
		var hValue = new Array();
		var gValue = new Array();
		var fValue = new Array();
		
		for (var i = 0; i < this.maxX; i++)
		{
			hValue[i] = new Array();
			gValue[i] = new Array();
			fValue[i] = new Array();
			parent[i] = new Array();
			for (var j = 0; j < this.maxY; j++)
			{
				hValue[i][j] = Math.abs(endX - i) + Math.abs(endY - j);
			}
		}
		
		gValue[startX][startY] = 0;
		parent[startX][startY] = -1;
		
		openList.push({x: startX, y: startY});
		while ((openList.length > 0) && (found == 0)) {
			var cur = openList[0];
			for (var i = 0; i < openList.length; i++)
			{
				var tile = openList[i];
				if (fValue[tile.x][tile.y] < fValue[cur.x][cur.y])
					cur = tile;
			}
			
			if ((cur.x == endX) && (cur.y == endY))
			{
				found = 1;
				break;
			}
			
			closedList.push(cur);
			var toRemove = this.indexOfPoint(openList, cur);
			if (toRemove != -1) openList.splice(toRemove, 1);
			
			var tile;
			var next = new Array();
			//Left tile
			tile = {x: cur.x - 1, y: cur.y};
			if ((cur.x > 0) && (this.tileCosts[tile.x][tile.y] >= 0)) 
				next.push(tile);
			//Right tile
			tile = {x: cur.x + 1, y: cur.y};
			if ((cur.x < (this.maxX - 1)) && (this.tileCosts[tile.x][tile.y] >= 0))
				next.push(tile);
			//Up tile
			tile = {x: cur.x, y: cur.y - 1};
			if ((cur.y > 0) && (this.tileCosts[tile.x][tile.y] >= 0)) 
				next.push(tile);
			//Down tile
			tile = {x: cur.x, y: cur.y + 1};
			if ((cur.y < (this.maxY -1)) && (this.tileCosts[tile.x][tile.y] >= 0)) 
				next.push(tile);
			
			for (var i = 0; i < next.length; i++)
			{
				if (this.indexOfPoint(closedList, next[i]) > -1) 
				{
					continue;
				}
				var newGValue = gValue[cur.x][cur.y] + 1 + this.tileCosts[next[i].x][next[i].y];
				var betterPath = 0;
				if (this.indexOfPoint(openList, next[i]) <= -1)
				{
					openList.push(next[i]);
					betterPath = 1;
				}
				else if (newGValue < gValue[next[i].x][next[i].y])
				{
					betterPath = 1;
				}
				if (betterPath == 1)
				{
					parent[next[i].x][next[i].y] = cur;
					gValue[next[i].x][next[i].y] = newGValue;
					fValue[next[i].x][next[i].y] = newGValue + hValue[next[i].x][next[i].y];
				}
			}
		}
		
		var target;
		if (found == 0)
		{
			if (this.cancel == 1)
			{
				this.error = "Target unreachable!";
				return;
			}
			else if (closedList.length > 0)
			{
				var nearEnd = closedList[0];
				for (var i = 1; i < closedList.length; i++)
				{
					var cur = closedList[i];
					if (hValue[nearEnd.x][nearEnd.y] > hValue[cur.x][cur.y])
					{
						nearEnd = cur;
					}
				}
				target = nearEnd;
			}
		}
		else
		{
			target = {x: endX, y: endY};
		}
		
		var cur = target;
		while ((cur.x != startX) || (cur.y != startY))
		{
			this.path.unshift(cur);
			cur = parent[cur.x][cur.y];
		}
	};
	
	Acts.prototype.ClearMap = function()
	{
		this.tileCosts = new Array();
		this.maxX = 0;
		this.maxY = 0;
	};
	
	Acts.prototype.CancelIfUnable = function(cancel)
	{
		this.cancel = cancel;
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.GetPathXAt = function (ret, id)
	{
		if (id >= this.path.length)
		{
			this.error = "Id of point in path is out of bounds!";
			ret.set_int(-1);
			return;
		}
		if (this.width > 0)
			ret.set_int(this.path[id].x * this.width);
		else
			ret.set_int(this.path[id].x);
	};
	
	Exps.prototype.GetPathYAt = function (ret, id)
	{
		if (id >= this.path.length)
		{
			this.error = "Id of point in path is out of bounds!";
			ret.set_int(-1);
			return;
		}
		if (this.height > 0)
			ret.set_int(this.path[id].y * this.height);
		else
			ret.set_int(this.path[id].y);
	};
	
	Exps.prototype.GetPathLength = function(ret)
	{
		ret.set_int(this.path.length);
	};
	
	Exps.prototype.GetError = function(ret)
	{
		ret.set_string(this.error);
	};
	
	pluginProto.exps = new Exps();

}());