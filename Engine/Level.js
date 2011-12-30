var Level = function() {
	this.Objects = [];
	this.Obsticles = [];
	this.Exits = [];
	this.ParticleSystems = [];
	this.TextBoxes = [];
	this.Lines = [];
	this.Size = new Vector();
	this.name = "";
	this.startPos = new Vector();
	this.playerPosition;
	this.background = "black";
	this.index;
}

var Line = function(mStartx,mStarty,mEndx,mEndy){
	this.startPos = new Vector(mStartx,mStarty);
	this.endPos = new Vector(mEndx,mEndy);
}

var TextBox = function (mTex,mPosX,mPosY,mSizeX,mSizeY,mColor){
	this.text = mTex;
	this.startPos = new Vector(mPosX,mPosY);
	this.Size = new Vector(mSizeX,mSizeY);
	this.color = mColor;
}

var LevelObject = function(sX,sY,mX,mY,mV) {
	var mDimensions = orientBox(sX,sY,mX,mY);
	this.startPos = mDimensions.vec1;
	this.Size = mDimensions.vec2.Sub(mDimensions.vec1);
	this.endPos = mDimensions.vec2;
	this.visible = mV;
}

var LevelObsticle = function(sX,sY,mX,mY,mH,mD) {
	var mDimensions = orientBox(sX,sY,mX,mY);
	this.startPos = mDimensions.vec1;
	this.Size = mDimensions.vec2.Sub(mDimensions.vec1);
	this.endPos = mDimensions.vec2;
	
	this.hurt = mH;
	this.dmgAmount = mD;
}

var LevelExit = function(sX,sY,mX,mY,con){
	var mDimensions = orientBox(sX,sY,mX,mY);
	this.startPos = mDimensions.vec1;
	this.Size = mDimensions.vec2.Sub(mDimensions.vec1);
	this.endPos = mDimensions.vec2;
	this.connectTo = con;
}

Level.prototype.Render = function(mContext) {
	this.drawLevel(mContext);
}

Level.prototype.drawLevel = function(mContext) {
	var levelObjs = this.Objects;
	var levelObs = this.Obsticles;
	var levelExts = this.Exits;
	var levelName = this.name;
	var levelTexts = this.TextBoxes;
	var levelLines = this.Lines;
	var levelParticles = this.ParticleSystems;
	
	// background
	this.drawBackground(mContext);
	
	// title properties
	mContext.font = "30pt Calibri";
	mContext.textAlign = "center";
	mContext.strokeStyle = "white";
	
	// title
	mContext.strokeText("GET TO THE END",this.Size.x/2,30);
	
	// level name properties
	mContext.textAlign = "left";
	mContext.font = "20pt Calibri";
	
	// level name
	mContext.strokeText(levelName,10,20);
	
	// Obj properties
	mContext.fillStyle = "aqua";
	
	// level objects
	for(var i=0;i<levelObjs.length;i++){
		var mObj = levelObjs[i];
		var objStart = mObj.startPos;
		var objSize = mObj.Size;
		
		mContext.strokeRect(objStart.x,objStart.y,objSize.x,objSize.y);

	}
	
	if(cObs.checked){

		// obsticle properties
		mContext.strokeStyle = "red";
		
		for(var i=0;i<levelObs.length;i++){
			var mObj = levelObs[i];
			var objStart = mObj.startPos;
			var objSize = mObj.Size;
			
			mContext.strokeRect(objStart.x,objStart.y,objSize.x,objSize.y);
		}
		
	}
	
	for(var i=0;i<levelExts.length;i++){
		var mObj = levelExts[i];
		var objStart = mObj.startPos;
		var objSize = mObj.Size;
		
		mContext.fillRect(objStart.x,objStart.y,objSize.x,objSize.y);		
	}
	
	// line properties
	mContext.strokeStyle = "grey";
	
	// level lines
	for(var i=0;i<levelLines.length;i++){
		var mObj = levelLines[i];
		var objStart = mObj.startPos;
		var objEnd = mObj.endPos;
		
		mContext.beginPath();
		mContext.moveTo(objStart.x, objStart.y);
		mContext.lineTo(objEnd.x, objEnd.y);
		mContext.closePath();
		mContext.fill();
		mContext.stroke();
	}
	
	// text properties
	mContext.fillStyle = "black";
	mContext.font = "8pt Verdana";
	
	// level text objs
	for(var i=0;i<levelTexts.length;i++){
		var mObj = levelTexts[i];
		var objStart = mObj.startPos;
		var objSize = mObj.Size;
		var mString = mObj.text;
		
		mContext.fillRect(objStart.x,objStart.y,objSize.x,objSize.y);
		mContext.strokeRect(objStart.x,objStart.y,objSize.x,objSize.y);

		mContext.strokeText(mString,objStart.x+5,objStart.y+(objSize.y/2))
	}
	
	// level particles
	for(var i=0;i<levelParticles.length;i++){
		var mSystem = levelParticles[i];
		mSystem.Render(mContext);
	}
	
}

Level.prototype.drawBackground = function(mContext) {
	
	mContext.fillStyle = this.background;
	mContext.fillRect(0,0,this.Size.x,this.Size.y);

}

Level.prototype.Reset = function() {
	return true;
}
