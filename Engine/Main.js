
var mWorld;

var Init = function(Canvas) {
	
	mWorld = new World(Canvas);
	
	mWorld.setBackground("black");
	
	mWorld.Player.setPos(100,100);
	
	setupLevels();
	
	setupLevelGenTools(false);
	
	mWorld.Init();
	
	Update();
	
}

var Update = function() {
	
	mWorld.Update();
	setTimeout("Update()",0);
	
}

var setupLevels = function() {
	
	var mLevels;
	GetFile( "Levels/Levels.txt", function onLoad( szObjSource ) { 
		mLevels = readLevelFile(szObjSource);
	});
	mWorld.Levels = mLevels;	

}

var keyDown = function(keycode) {
	
	// A
	if(keycode == 65){
		mWorld.Player.Controller.moveLeft = true;
	}
	
	// D
	if(keycode == 68){
		mWorld.Player.Controller.moveRight = true;
	}
	
	// Space
	if(keycode == 32){
		mWorld.Player.Controller.Jump();
	}
}

var keyUp = function(keycode) {
	
	// A
	if(keycode == 65){
		mWorld.Player.Controller.moveLeft = false;
	}
	
	// D
	if(keycode == 68){
		mWorld.Player.Controller.moveRight = false;
	}

}

var Undo = function() {
	mWorld.currentLevel.Objects.pop();
	mWorld.Player.Controller.resetStatus();
}

var outputLevel = function(level,domEle) {
	
	var mLevel = level;
	var mElement = domEle;
	var mString = "";
	
	var mObjects = mLevel.Objects;
	var mName = mLevel.name;
	var pStartPos = mLevel.startPos;
	var mNextLevel = mLevel.nextLevel;
	
	mString += "\n" + "<" + mName + ">";
	mString += "\n" + ":playerstart" + " " + pStartPos.x + " " + pStartPos.y;
	mString += "\n" + ":next" + " " + mNextLevel;
	for(var i=0;i<mObjects.length;i++){
		var mObj = mObjects[i];
		
		var x1 = mObj.startPos.x;
		var y1 = mObj.startPos.y;
		var x2 = mObj.Size.x;
		var y2 = mObj.Size.y;
		
		if(mObj.exit){
			mString += "\n" + ":exit";
		}else{
			mString += "\n" + ":Obj";
		}
		
		mString += " " + x1 +" " + y1 +" " + x2 +" " + y2;
		
	}
	mString += "\n" + ";"
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
			var pStart;
			var nLevel;
	
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
				var mObj = new LevelObject(x1,y1,x2,y2);
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
				var mObj = new LevelObject(x1,y1,x2,y2);
				mObj.exit = true;
				Objects.push(mObj);
			}else if(params[0] == "next"){
				var index = parseInt(params[1]);
				nLevel = index;
			}
		}else if(line[0] == ';'){
			mLevel.name = Name;
			mLevel.Objects = Objects;
			mLevel.startPos = pStart;
			mLevel.nextLevel = nLevel;
			mLevels.push(mLevel);
		}
		
	}
	
	return mLevels;
}

var setupLevelGenTools = function(param){
	
	var mod;
	if(!param)
		mod = "none";
	else
		mod = "inline";
	
	tArea.style.display = mod;
	bOutput.style.display = mod;
	bUndo.style.display = mod;
	bClear.style.display = mod;
	cExit.style.display = mod;	
  	
  	if(param){
	  	var mouseDownVec = false;
		var mouseUpVec = false;
		var mouseDownDate;
		
		Canvas.addEventListener('mousedown',function(e){
			
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
		
			mouseDownVec = new Vector(x,y);
			mouseDownDate = new Date;
		},false);
		
		Canvas.addEventListener('mouseup',function(e){
				if(tempObj){
					mWorld.currentLevel.Objects.pop();
					tempObj = false;
				}
				
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
		
			mouseUpVec = new Vector(x,y);
			
			if(mouseDownVec && mouseUpVec){
				
				var x1;
				var x2;
				var y1;
				var y2;
				
				// 
				var objS = new Vector(mouseDownVec.x,mouseDownVec.y);
				var objF = new Vector(mouseUpVec.x,mouseUpVec.y);
				
				// path objs are specified starting at the top left
				// and then extending right and down
				
				// identify the correct start x and width
				if(objF.x>objS.x){
					x1 = objS.x;
					x2 = objF.x-objS.x;
				}else {
					x1 = objF.x;
					x2 = objS.x-objF.x;	
				}
				
				// identify the correct start y and height
				if(objF.y>objS.y){
					y1 = objS.y;
					y2 = objF.y-objS.y;
				}else {
					y1 = objF.y;
					y2 = objS.y-objF.y;
				}
				
				var mObj = new LevelObject(x1,y1,x2+1,y2+1);
				mObj.exit = document.getElementById("exit").checked;
				mWorld.currentLevel.Objects.push(mObj);
			}
		
			mouseUpVec = false;
			mouseDownVec = false;
		
		},false);
		
		var tempObj = false;
		Canvas.addEventListener('mousemove',function(e){
			
			if(tempObj){
				mWorld.currentLevel.Objects.pop();
				tempObj = false;
			}
			
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
		
			mouseUpVec = new Vector(x,y);
			
			if(mouseDownVec && mouseUpVec){
				
				var x1;
				var x2;
				var y1;
				var y2;
				
				// 
				var objS = new Vector(mouseDownVec.x,mouseDownVec.y);
				var objF = new Vector(mouseUpVec.x,mouseUpVec.y);
				
				// path objs are specified starting at the top left
				// and then extending right and down
				
				// identify the correct start x and width
				if(objF.x>objS.x){
					x1 = objS.x;
					x2 = objF.x-objS.x;
				}else {
					x1 = objF.x;
					x2 = objS.x-objF.x;	
				}
				
				// identify the correct start y and height
				if(objF.y>objS.y){
					y1 = objS.y;
					y2 = objF.y-objS.y;
				}else {
					y1 = objF.y;
					y2 = objS.y-objF.y;
				}
				var mObj = new LevelObject(x1,y1,x2+1,y2+1);
				mWorld.currentLevel.Objects.push(mObj);
				tempObj = true;
			}
			
		},false);
  	}
}
