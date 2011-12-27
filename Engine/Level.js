var Level = function() {
	this.Objects = [];
	this.Size = new Vector();
	this.name = "";
	this.startPos = new Vector();
	this.nextLevel;
}

var LevelObject = function(sX,sY,mX,mY) {
	this.startPos = new Vector(sX,sY);
	this.Size = new Vector(mX,mY);
	this.exit = false
}
