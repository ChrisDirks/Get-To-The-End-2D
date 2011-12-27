
var World = function(mCanvas) {
	
	this.Canvas = mCanvas;
	this.Context = this.Canvas.getContext("2d");
	this.Size = new Vector(this.Canvas.width,this.Canvas.height);
	this.Levels = [];
	this.currentLevel;
	this.Player = new Player();
	this.Background = {};
	this.Background.color;
	this.pause = false;
	
}

World.prototype.Init = function() {
	this.setupLevel(0);
}

World.prototype.setupLevel = function(param) {
	var nLevel;
	
	if(!this.Levels[param]){
		nLevel = new Level();
		nLevel.name = "Level " + (param+1);
		nLevel.startPos = new Vector(100,472);
		nLevel.nextLevel = param+1;
		var mObj = new LevelObject(614,457,15,23);
		mObj.exit = true;
		nLevel.Objects.push(mObj);
		
	}
	else
		nLevel = this.Levels[param];
		
	this.currentLevel = nLevel;
	this.Player.Controller.Position = this.currentLevel.startPos;
}

World.prototype.Update = function() {
	
	if(this.pause){
		return;
	}
	
	this.Physics();
	this.Render();
}

World.prototype.Physics = function() {
	
	this.updatePlayer();
	this.worldCollision();
}

World.prototype.Render = function() {
	
	this.drawBackground();
	this.drawLevel();
	this.drawPlayer();
}

World.prototype.drawPlayer = function() {
	
	this.Context.fillStyle = "grey";
	this.Context.strokeStyle = "white";
	
	var left = this.Player.Controller.Position.x-5;
	var top = this.Player.Controller.Position.y-8;
	
	this.Context.fillRect(left,top,10,16);
	this.Context.strokeRect(left,top,10,16);
}

World.prototype.updatePlayer = function() {
	
	var pController = this.Player.Controller;
	// update player controller motion
	var time = 0.05;
	pController.Update(time);
	
	this.Player.updateBounds();

}

World.prototype.worldCollision = function() {
	var pController = this.Player.Controller;
	var pPosition = pController.Position;
	var pBounds = this.Player.Bounds;
	var levelObjs = this.currentLevel.Objects;
	
	// iterate through level objs
	for(var i=0;i<levelObjs.length;i++){
		
		var mObj = levelObjs[i];
		
		// level object start and end vectors
		var objStart = mObj.startPos;
		var objEnd = objStart.Add(mObj.Size);
		
		// player start and end vectors
		var pStart = new Vector(this.Player.Bounds.left,this.Player.Bounds.top);
		var pEnd = new Vector(this.Player.Bounds.right,this.Player.Bounds.bottem);
			
		// basic collision detection
		if(isColliding(pStart,pEnd,objStart,objEnd)){
			
			if(mObj.exit){
				var lIndex = this.currentLevel.nextLevel;
				this.setupLevel(lIndex);
				pController.resetStatus();
			}
			
			// difference between obj and player collision sides
			var mXDiff;
			var mYDiff;
			
			// set diff based on current velocity
			if(pController.Velocity.x >= 0){
				
				// obj left - player right
				mXDiff = objStart.x - pEnd.x;
			}else {
				
				// obj right - player left
				mXDiff = objEnd.x - pStart.x;
			}
			
			if(pController.Velocity.y >= 0){
				
				// obj top - player bottem
				mYDiff = objStart.y - pEnd.y;
			}else {
				
				// obj bottem - player top
				mYDiff = objEnd.y - pStart.y;
			}
			
			// normalize and inverse
			var vNorm = pController.Velocity.Normalize();
			vNorm = vNorm.Multiply(-1);
			
			// get factor needed to reach the edge
			// using the inverse normal velocity
			// lowest factor dictates the correct hit edge
			var xFac = mXDiff/vNorm.x;
			var yFac = mYDiff/vNorm.y;
			
			// lowest factor
			var mFac;
			
			if(xFac<=yFac){
				
				// set xFac as lowest
				mFac = Math.abs(xFac);
				
				// remove y for repositioning
				vNorm.y = 0;
				
				// negate x velocity
				pController.Velocity.x = 0.0;
				
				// calc position by adding back the inverse norm multiplied by the lowest factor
				pController.Position.x = pController.Position.Add(vNorm.Multiply(mFac)).x;
				
			}else {
				
				// set yFac as lowest
				mFac = Math.abs(yFac);
				
				// remove x for repositioning
				vNorm.x = 0;
				
				// negate y velocity
				pController.Velocity.y = 0.0;
				
				if(vNorm.y<0){
					// inverse was negetive...player was moving down and is now resting on obj
					pController.grounded = true;
				}
				
				// calc position by adding back the inverse norm multiplied by the lowest factor
				pController.Position.y = pController.Position.Add(vNorm.Multiply(mFac)).y;
			}
			
			// update player boundings
			this.Player.updateBounds();
			
		}
		
	}
	
	// floor
	if(this.Player.Bounds.bottem > this.Size.y){
		pPosition.y = this.Size.y-this.Player.Size.y/2;
		pController.Velocity.y = 0.0;
		pController.grounded = true;
	}
	// left
	if(this.Player.Bounds.left < 0){
		pPosition.x = this.Player.Size.x/2;
		pController.Velocity.x = 0.0;
	}
	// right
	if(this.Player.Bounds.right > this.Size.x){
		pPosition.x = this.Size.x-this.Player.Size.x/2;
		pController.Velocity.x = 0.0;
	}
	// ciel
	if(this.Player.Bounds.top < 0){
		pPosition.y = this.Player.Size.y/2;
		pController.Velocity.y = 0.0;
	}
	
	this.Player.updateBounds();
}

World.prototype.setBackground = function(param) {
	this.Background.color = param;
}

World.prototype.drawLevel = function() {
	
	this.Context.strokeStyle = "white";
	this.Context.fillStyle = "aqua";
	this.Context.font = "30pt Calibri";
	this.Context.textAlign = "center";
	var levelObjs = this.currentLevel.Objects;
	var levelName = this.currentLevel.name;
	
	// title
	this.Context.strokeText("GET TO THE END",this.Size.x/2,30);
	
	this.Context.textAlign = "left";
	this.Context.font = "20pt Calibri";
	
	// level name
	this.Context.strokeText(levelName,10,20);
	
	// level objects
	for(var i=0;i<levelObjs.length;i++){
		var mObj = levelObjs[i];
		var objStart = mObj.startPos;
		var objSize = mObj.Size;
		
		if(mObj.exit){
			this.Context.fillRect(objStart.x,objStart.y,objSize.x,objSize.y);
		}else {
			this.Context.strokeRect(objStart.x,objStart.y,objSize.x,objSize.y);
		}

	}

}

World.prototype.drawBackground = function() {
	
	this.Context.fillStyle = this.Background.color;
	this.Context.fillRect(0,0,this.Size.x,this.Size.y);
}