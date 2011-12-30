var Magnitude = function (_Vec) {
	return Math.sqrt(Math.pow(_Vec.x,2)+Math.pow(_Vec.y,2));
}

var Add = function (_Vec1,_Vec2) {
	var x1 = _Vec1.x+_Vec2.x;
	var y1 = _Vec1.y+_Vec2.y;
	return new Vector(x1,y1);
}

var Norm = function (_Vec) {
	var a = _Vec.x/Magnitude(_Vec); 
	var b = _Vec.y/Magnitude(_Vec); 
	return new Vector(a,b);
}

var Array2D = function (x,y){
	if(x,y){
		var mArray = new Array(x);
		for(var i=0;i<x;i++){
			mArray[i] = new Array(y);
		}	
	}
	return mArray;
}

var CanvasReset = function (_Canvas) {
	if(_Canvas)
  		_Canvas.width = _Canvas.width;
}

Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};

//vector constructor
function Vector (mx,my) {
	if (typeof mx == "object") {
		var mVec = new Vector(mx.x,mx.y);
		return mVec;
	}else {
		this.x = mx;
		this.y = my;
	}
}

Vector.prototype.Normalize = function () {
	var x1;
	var y1;
	
	var x1 = (this.x==0)? 0:this.x/this.Magnitude();
	var y1 = (this.y==0)? 0:this.y/this.Magnitude();
	
	return new Vector(x1,y1);
}

Vector.prototype.Magnitude = function () {
	return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
}
Vector.prototype.Multiply = function (m_vector) {
	if (typeof m_vector == "object") {
		var x1 = this.x*m_vector.x;
		var y1 = this.y*m_vector.y;
		return new Vector(x1,y1);
	}else {
		var x1 = this.x*m_vector;
		var y1 = this.y*m_vector;
		return new Vector(x1,y1);
	}	
}

Vector.prototype.Sub = function (m_vector) {
	var x1 = this.x-m_vector.x;
	var y1 = this.y-m_vector.y;
	return new Vector(x1,y1);
}

Vector.prototype.Equals = function (m_vector){
	if(this.x==m_vector.x && this.y==m_vector.y){
		return true;
	}else {
		return false;
	}	
}

Vector.prototype.Add = function (m_vector) {
	var x1 = this.x+m_vector.x;
	var y1 = this.y+m_vector.y;
	return new Vector(x1,y1);
}

Vector.prototype.DotProd = function (m_vector){
	return (this.x*m_vector.x)+(this.y*m_vector.y);
}

var Log = function(param) {
	console.log(param);
}

var getMousePosition = function (data){
	var e = data;
	var x;
	var y;
			
	if (e.pageX || e.pageY) { 
		x = e.pageX;
		y = e.pageY;
	}else { 
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	} 
		
	x -= Canvas.offsetLeft;
	y -= Canvas.offsetTop;	
	
	return new Vector(x,y);
}

var isColliding = function(start1,end1,start2,end2){
	
	var pLeft = start1.x;
	var pRight = end1.x;
	var pTop = start1.y;
	var pBottem = end1.y;
	
	var oLeft = start2.x;
	var oRight = end2.x;
	var oTop = start2.y;
	var oBottem = end2.y;
	
	if(pRight > oLeft && pRight < oRight){
		if(pBottem > oTop && pBottem < oBottem){	
			return true;
		}
		if(pTop > oTop && pTop < oBottem){
			return true;
		}
		if(oBottem > pTop && oBottem < pBottem){	
			return true;
		}
		if(oTop > pTop && oTop < pBottem){
			return true;
		}
	}

	if(pLeft > oLeft && pLeft < oRight){
		if(pBottem > oTop && pBottem < oBottem){	
			return true;
		}
		if(pTop > oTop && pTop < oBottem){
			return true;
		}
		if(oBottem > pTop && oBottem < pBottem){	
			return true;
		}
		if(oTop > pTop && oTop < pBottem){
			return true;
		}
	}
	
	if(oLeft > pLeft && oLeft < pRight){
		if(pBottem > oTop && pBottem < oBottem){	
			return true;
		}
		if(pTop > oTop && pTop < oBottem){
			return true;
		}
		if(oBottem > pTop && oBottem < pBottem){	
			return true;
		}
		if(oTop > pTop && oTop < pBottem){
			return true;
		}
		
	}
	
	return false;	
}

var Display = function(param) {
	if(!document.getElementById("pState")){
		var para = document.createElement("p");
		para.id = "pState";
		para.style.zIndex = 2;
		var head = document.getElementsByTagName("body")[0];
		head.appendChild(para);	
	}
	
	var pState = document.getElementById("pState");
	pState.innerHTML = param;
}

var GetFile = function( szFilename, onCompleteFunc, bAsynchronous ) {
	var bAsync = bAsynchronous || false; // load synchronously by default
	var XHR = new XMLHttpRequest();
	XHR.onreadystatechange = function() {
		if( XHR.readyState == 4 && XHR.status == 200 )
			onCompleteFunc( XHR.responseText );
	};
	XHR.open( "GET", szFilename, bAsync );
	XHR.send();
}

var outputLevel = function(levels,domEle) {
	if(!Array.isArray(levels)){
		var mLevels = [levels];
	}else{
		var mLevels = levels;
	}
	
	var mElement = domEle;
	var mString = "";
	
	for( var k=0;k<mLevels.length;k++){
		var mLevel = mLevels[k];
		
		var mObjects = mLevel.Objects;
		var mObsticles = mLevel.Obsticles;
		var mParticles = mLevel.ParticleSystems;
		var mExits = mLevel.Exits;
		var mLines = mLevel.Lines;
		var mName = mLevel.name;
		var pStartPos = mLevel.startPos;
		var mSize = mLevel.Size;
		var mIndex = mLevel.index;
		
		mString += "\n" + "<" + mName + ">";
		mString += "\n" + ":playerstart" + " " + pStartPos.x + " " + pStartPos.y;
		mString += "\n" + ":size" + " " + mSize.x + " " + mSize.y;
		mString += "\n" + ":index" + " " + mLevel.index;
		
		for(var i=0;i<mObjects.length;i++){
			var mObj = mObjects[i];
			
			var x1 = mObj.startPos.x;
			var y1 = mObj.startPos.y;
			var x2 = mObj.endPos.x;
			var y2 = mObj.endPos.y;
			var mV = mObj.visible;
			
			mString += "\n" + ":Obj";
			
			mString += " " + x1 +" " + y1 +" " + x2 +" " + y2 + " " + mV;
			
		}
		
		for(var i=0;i<mObsticles.length;i++){
			var mObj = mObsticles[i];
			
			var x1 = mObj.startPos.x;
			var y1 = mObj.startPos.y;
			var x2 = mObj.endPos.x;
			var y2 = mObj.endPos.y;
			var mHurt = mObj.hurt;
			var mDmg = mObj.dmgAmount;
	
			mString += "\n" + ":Obs";
	
			mString += " " + x1 +" " + y1 +" " + x2 +" " + y2 + " " + mHurt + " " + mDmg;
			
		}
		
		for(var i=0;i<mExits.length;i++){
			var mObj = mExits[i];
			
			var x1 = mObj.startPos.x;
			var y1 = mObj.startPos.y;
			var x2 = mObj.endPos.x;
			var y2 = mObj.endPos.y;
			var connect = mObj.connectTo;
			
			mString += "\n" + ":exit";
	
			mString += " " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + connect;
			
		}
		
		for(var i=0;i<mLines.length;i++){
			var mObj = mLines[i];
			
			var x1 = mObj.startPos.x;
			var y1 = mObj.startPos.y;
			var x2 = mObj.endPos.x;
			var y2 = mObj.endPos.y;
			
			mString += "\n" + ":line";
			
			mString += " " + x1 +" " + y1 +" " + x2 +" " + y2;
			
		}
		
		for(var i=0;i<mParticles.length;i++){
			var mParticle = mParticles[i];
			
			mString += "\n" + ":Part";
	
			mString += " " + mParticle.particleType + " " + mParticle.position.x + " " + mParticle.position.y + " " + 
			mParticle.maxParticles + " " + mParticle.degradeRange.x + " " + mParticle.degradeRange.y + " " + 
			mParticle.velocityY.x + " " + mParticle.velocityY.y + " " + mParticle.velocityX.x + " " + mParticle.velocityX.y + " " + 
			mParticle.sizeRange.y + " " + mParticle.sizeRange.x + " " + mParticle.lifeRange.x + " " + mParticle.lifeRange.y + " " + 
			mParticle.color + " " + mParticle.Area.x + " " + mParticle.Area.y + " " + mParticle.emitTime + " " + mParticle.emitAmt;
			
		}
		
		mString += "\n" + ";"
	}
	mElement.innerHTML = mString;
}

var readLevelFile = function(file) {
	
	var lFile = file
	var mLevels = [];
	var lines = lFile.split( "\n" );
	
	for(var i=0;i<lines.length;i++){
		var line = lines[i];
		
		if(line[0] == '#'){
			continue;
		}
		
		if(line[0] == '<'){
			
			var mLevel = new Level();
			var Name = "";
			var Objects = [];
			var Obsticles = [];
			var Exits = [];
			var pSystems = [];
			var Lines = [];
			var pStart;
			var nLevel;
			var lSize;
			var lIndex;
			
			var array = "";
			for(var j=1;j<line.length;j++){
				if(line[j] != '>')
					array += line[j];
				else
					break;
			}
			Name = array;
		}else if(line[0] == ':'){
			line = line.slice(1);
			var array = "";
			var params = line.split(" ");
			if((params[0]) == "Obj"){
				var x1 = parseInt(params[1]);
				var y1 = parseInt(params[2]);
				var x2 = parseInt(params[3]);
				var y2 = parseInt(params[4]);
				var mV = params[5];
				var mObj = new LevelObject(x1,y1,x2,y2,params[5]);
				Objects.push(mObj);
			}else if(params[0] == "playerstart"){
				var x1 = parseInt(params[1]);
				var y1 = parseInt(params[2]);
				var mObj = new Vector(x1,y1);
				pStart = mObj;
			}else if(params[0] == "exit"){
				var x1 = parseInt(params[1]);
				var y1 = parseInt(params[2]);
				var x2 = parseInt(params[3]);
				var y2 = parseInt(params[4]);
				var con = parseInt(params[5])
				var mObj = new LevelExit(x1,y1,x2,y2,con);
				Exits.push(mObj);
			}else if(params[0] == "Part"){
				var nPart = new ParticleSystem();
				nPart.particleType = parseInt(params[1]);
				nPart.position = new Vector(parseFloat(params[2]),parseFloat(params[3]));
				nPart.maxParticles  = parseInt(params[4]);
				nPart.degradeRange = new Vector(parseFloat(params[5]),parseFloat(params[6]));
				nPart.velocityY = new Vector(parseFloat(params[7]),parseFloat(params[8]));
				nPart.velocityX = new Vector(parseFloat(params[9]),parseFloat(params[10]));
				nPart.sizeRange = new Vector(parseFloat(params[11]),parseFloat(params[12]));
				nPart.lifeRange = new Vector(parseFloat(params[13]),parseFloat(params[14]));
				nPart.color = params[15];
				nPart.Area = new Vector(parseFloat(params[16]),parseFloat(params[17]));
				nPart.emitTime = parseFloat(params[18]); 
				nPart.emitAmt = parseInt(params[19]) 
				pSystems.push(nPart);
			}else if(params[0] == "line"){
				var x1 = parseInt(params[1]);
				var y1 = parseInt(params[2]);
				var x2 = parseInt(params[3]);
				var y2 = parseInt(params[4]);
				var mObj = new Line(x1,y1,x2,y2);
				Lines.push(mObj);
			}else if(params[0] == "size"){
				var x1 = parseInt(params[1]);
				var y1 = parseInt(params[2]);
				var lSize = new Vector(x1,y1);
			}else if(params[0] == "Obs"){
				var x1 = parseInt(params[1]);
				var y1 = parseInt(params[2]);
				var x2 = parseInt(params[3]);
				var y2 = parseInt(params[4]);
				var mH = parseInt(params[5]);
				var mD = parseFloat(params[6]);
				var mObj = new LevelObsticle(x1,y1,x2,y2,mH,mD);
				Obsticles.push(mObj);
			}else if(params[0] == "index"){
				lIndex = parseInt(params[1]);
			}
		}else if(line[0] == ';'){
			mLevel.name = Name;
			mLevel.Objects = Objects;
			mLevel.Obsticles = Obsticles;
			mLevel.Exits = Exits;
			mLevel.ParticleSystems = pSystems;
			mLevel.Lines = Lines;
			mLevel.startPos = pStart;
			mLevel.nextLevel = nLevel;
			mLevel.Size = lSize;
			mLevel.index = lIndex;
			mLevels.push(mLevel);
		}
		
	}
	
	return mLevels;
}

var orientBox = function(sx,sy,fx,fy){
				
	var x1;
	var x2;
	var y1;
	var y2;
		
	// identify the correct start x and width
	if(fx>sx){
		x1 = sx;
		x2 = fx;
	}else {
		x1 = fx;
		x2 = sx;	
	}
				
	// identify the correct start y and height
	if(fy>sy){
		y1 = sy;
		y2 = fy;
	}else {
		y1 = fy;
		y2 = sy;
	}
	var SVec = new Vector(x1,y1);
	var FVec = new Vector(x2,y2);
	return ({ "vec1":SVec,"vec2":FVec});
}
