var toolOptions;
var updateDebugOpt = function(){
	
	var mOptions = eOptions.children;
	
	for(var i=0;i<mOptions.length;i++){
		mOptions[i].style.display = "none";
	}
	
	var mTools = divTool.children;
	for(var i=0;i<mTools.length;i++){
		var mTool = mTools[i];
		if(mTool.checked){
			break;
		}
	}
	
	if(mTool.id == "rObj"){
		mOptions[0].style.display = "inline";
		toolOptions = mOptions[0].children;
	}else if(mTool.id == "rExit"){
		mOptions[2].style.display = "inline";
		toolOptions = mOptions[2].children;
	}else if(mTool.id == "rPart"){
		mOptions[1].style.display = "inline";
		toolOptions = mOptions[1].children;
	}else if(mTool.id == "rLine"){
		mOptions[4].style.display = "inline";
		toolOptions = mOptions[4].children;
	}else if(mTool.id == "rObs"){
		mOptions[3].style.display = "inline";
		toolOptions = mOptions[3].children;
	}
	
}

var mouseDownVec;
var mouseUpVec;
var tempObj = false;
var setupLevelGenTools = function(param){
	
	var mod;
	
	if(!param)
		mod = "none";
	else
		mod = "inline";
	
	divTool.style.display = mod;
  	
  	if(param){
		
		Canvas.addEventListener('mousedown',function(e){
			
			mouseDownVec = getMousePosition(e);
			
		},false);

		var tempObj = false;
		Canvas.addEventListener('mouseup',function(e){fMouseAdd(e);},false);
		Canvas.addEventListener('mousemove',function(e){fMouseAdd(e,true);},false);
  	}
}

var fMouseAdd = function (e,move){
			
	if(tempObj){
		mWorld.Undo();	
		tempObj = false;
	}
				
	mouseUpVec = getMousePosition(e);
			
	if(mouseDownVec){
				
		var objS = new Vector(mouseDownVec.x,mouseDownVec.y);
		var objF = new Vector(mouseUpVec.x,mouseUpVec.y);
		
		var toolIndex;		
		var mTools = divTool.children;
		for(var i=0;i<mTools.length;i++){
			var mTool = mTools[i];
			if(mTool.checked){
				toolIndex = i;
				break;
			}
		}
		
		var fDownVec = new Vector(objS.x,objS.y);
		var fUpVec = new Vector(objF.x+1,objF.y+1);
		
		addLevelObj(toolIndex,fDownVec,fUpVec);
		
		if(move){
			tempObj = true;
			mouseUpVec = false;	
		}else{
			mouseUpVec = false;
			mouseDownVec = false;		
		}

	}
		
}

var addLevelObj = function(objNum,downVec,upVec){
	
	if(objNum==0){
		var mObj = new LevelObject(downVec.x,downVec.y,upVec.x,upVec.y,toolOptions[0].value);
		mWorld.currentLevel.Objects.push(mObj);
		mWorld.undoStack.push("Obj");
	}else if(objNum==2){
		var dmg = parseFloat(toolOptions[2].value);
		var mObj = new LevelObsticle(downVec.x,downVec.y,upVec.x,upVec.y, parseInt(toolOptions[0].value),dmg);
		mWorld.currentLevel.Obsticles.push(mObj);
		mWorld.undoStack.push("Obs");
	}else if(objNum==4){
		var val = parseInt(toolOptions[0].value);
		var mObj = new LevelExit(downVec.x,downVec.y,upVec.x,upVec.y,val);
		mWorld.currentLevel.Exits.push(mObj);
		mWorld.undoStack.push("Ext");
	}else if(objNum==6){
		var nPS = new ParticleSystem;
		nPS.particleType = parseInt(toolOptions[0].value);
		nPS.position = downVec;
		nPS.maxParticles = parseInt(toolOptions[2].value);
		var dL = parseFloat(toolOptions[8].value);
		var dH = parseFloat(toolOptions[10].value);
		nPS.degradeRange = new Vector(dL,dH);
		var vxl = parseFloat(toolOptions[12].value);
		var vxh = parseFloat(toolOptions[14].value);
		nPS.velocityX = new Vector(vxl,vxh);
		var vyl = parseFloat(toolOptions[16].value);
		var vyh = parseFloat(toolOptions[18].value);
		nPS.velocityY = new Vector(vyl,vyh);
		var srl = parseFloat(toolOptions[20].value);
		var srh = parseFloat(toolOptions[22].value);
		nPS.sizeRange = new Vector(srl,srh);
		var lrl = parseFloat(toolOptions[24].value);
		var lrh = parseFloat(toolOptions[26].value);
		nPS.lifeRange = new Vector(lrl,lrh);
		nPS.color = toolOptions[28].value;
		var ax = parseFloat(toolOptions[4].value);
		var ay = parseFloat(toolOptions[6].value);
		nPS.Area = new Vector(ax,ay);
		var et = parseFloat(toolOptions[32].value);
		nPS.emitTime = et;
		var ea = parseFloat(toolOptions[30].value);
		nPS.emitAmt = ea;
		mWorld.currentLevel.ParticleSystems.push(nPS);
		mWorld.undoStack.push("Prt");
	}else if(objNum==8){
		var val = parseInt(toolOptions[0].value);
		var mLine = new Line(downVec.x,downVec.y,upVec.x,upVec.y);
		mWorld.currentLevel.Lines.push(mLine);
		mWorld.undoStack.push("Lne");
	}
}