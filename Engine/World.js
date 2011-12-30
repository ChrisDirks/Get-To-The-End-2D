var World = function(mCanvas) {
	
	this.Canvas = mCanvas;
	this.Context = this.Canvas.getContext("2d");
	this.Size = new Vector(this.Canvas.width,this.Canvas.height);
	this.Levels = [];
	this.currentLevel;
	this.Player = new Player();
	this.pause = false;
	this.initTime = new Date;
	this.status = "";
	this.fadeOpacity = 0.0;
	this.procedure = [];
	this.undoStack = [];
}

World.prototype.Init = function() {
	this.setupLevel(1);
}

World.prototype.setupLevel = function(param) {
	var nLevel;

	for(var i=0;i<this.Levels.length;i++){
		if(this.Levels[i].index == param){
			nLevel = this.Levels[i];
			break
		}
	}
		
	if(!nLevel){
		if(!this.Levels[param]){
			nLevel = new Level();
			nLevel.name = "Level " + (param+1);
			nLevel.Size = this.Size;
			nLevel.startPos = new Vector(100,472);
			
		}		
	}
	this.currentLevel = nLevel;
	this.Player.Controller.Position = this.currentLevel.startPos;
}

World.prototype.Update = function() {
	var mStatus = this.status;
	
	if(this.pause){
		return;
	}
	
	
	if(mStatus == "init"){
		this.Init();
		this.status = "main";
	}else if(mStatus == "Reset"){
		if(this.procedure.length > 0){
			var functionName = this.procedure[0];
			var context = this;
			var args = Array.prototype.slice.call(arguments).splice(2);
			var namespaces = functionName.split(".");
			var func = namespaces.pop();
			for(var i = 0; i < namespaces.length; i++) {
				context = context[namespaces[i]];
			}
			var status = context[func].apply(context, args);
		}else{
			this.status = "main";
		}
			
		if(status){
			this.procedure.shift();
		}			
		
	}else if(mStatus == "main"){
		this.Physics();
		this.Render();		
	}
		
}

World.prototype.Physics = function() {
	this.Player.Update(0.05);
	this.worldCollision();
	this.updateParticles(0.015);
}

World.prototype.Render = function() {
	this.currentLevel.Render(this.Context);
	this.Player.Render(this.Context);
}

World.prototype.worldCollision = function() {
	
	var pController = this.Player.Controller;
	var pPosition = pController.Position;
	var pBounds = this.Player.Bounds;
	var levelObjs = this.currentLevel.Objects;
	var levelObs = this.currentLevel.Obsticles;
	var levelExts = this.currentLevel.Exits;
	var eventCollision;

	
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
	
	for(var i=0;i<levelExts.length;i++){
		var mObj = levelExts[i];
		
		// level object start and end vectors
		var objStart = mObj.startPos;
		var objEnd = objStart.Add(mObj.Size);
		
		// player start and end vectors
		var pStart = new Vector(this.Player.Bounds.left,this.Player.Bounds.top);
		var pEnd = new Vector(this.Player.Bounds.right,this.Player.Bounds.bottem);
		
		eventCollision = false;	
		// basic collision detection
		if(isColliding(pStart,pEnd,objStart,objEnd)){
			
			eventCollision = true;
			
			if(!pController.collisioneventReset){
				var lIndex = mObj.connectTo;
				this.setupLevel(lIndex);
				pController.resetStatus();
				pController.collisioneventReset = true;
				return;
			}
			
		}
		
	}
	
	pController.collisioneventReset = eventCollision;
	
	for(var i=0;i<levelObs.length;i++){
		var mObj = levelObs[i];
		
		// level object start and end vectors
		var objStart = mObj.startPos;
		var objEnd = objStart.Add(mObj.Size);
		
		// player start and end vectors
		var pStart = new Vector(this.Player.Bounds.left,this.Player.Bounds.top);
		var pEnd = new Vector(this.Player.Bounds.right,this.Player.Bounds.bottem);
			
		// basic collision detection
		if(isColliding(pStart,pEnd,objStart,objEnd)){
			
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
				var newPos = pController.Position.Add(vNorm.Multiply(mFac));
				this.Player.setPosition(newPos.x,pController.Position.y);
				
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
				var newPos = pController.Position.Add(vNorm.Multiply(mFac));
				this.Player.setPosition(pController.Position.x,newPos.y);
			}
			
			if(mObj.hurt){
				// apply dmg
				var  pStatus = this.Player.applyDamage(mObj.dmgAmount);				
			}

			if(pStatus){
				
				this.status = "Reset";
				this.procedure.push("fadeOut");
				this.procedure.push("Reset");
				this.procedure.push("currentLevel.Reset");
				this.procedure.push("Player.Reset");
				this.procedure.push("fadeIn");
			}
			
		}
	}
	
	// floor
	if(this.Player.Bounds.bottem > this.Size.y){
		var newY = this.Size.y-this.Player.Size.y/2;
		this.Player.setPosition(pController.Position.x,newY);
		pController.Velocity.y = 0.0;
		pController.grounded = true;
	}
	
	// left
	if(this.Player.Bounds.left < 0){
		var newX = this.Player.Size.x/2;
		this.Player.setPosition(newX,pController.Position.y);
		pController.Velocity.x = 0.0;
	}
	// right
	if(this.Player.Bounds.right > this.Size.x){
		var newX = this.Size.x-this.Player.Size.x/2;
		this.Player.setPosition(newX,pController.Position.y);
		pController.Velocity.x = 0.0;
	}
	// ciel
	if(this.Player.Bounds.top < 0){
		var newY = this.Player.Size.y/2;
		this.Player.setPosition(pController.Position.x,newY);
		pController.Velocity.y = 0.0;
	}
}

World.prototype.updateParticles = function(param) {
	var pSystems = this.currentLevel.ParticleSystems;
	var time = param;
	
	for(var i=0;i<pSystems.length;i++){
		var system = pSystems[i];
		var sParticles = system.Particles;
		
		var partDiff = system.maxParticles - sParticles.length
		var partGen = (system.emitAmt>0)? system.emitAmt:partDiff;
		
		if(partDiff>0){
			if(system.delay<=0){
				for(var j=0;j<partGen;j++){
					system.generateParticle();
				}
				system.delay = system.emitTime;			
			}else{
				system.delay = system.delay-time;
			}

		}
		var dead = [];
		
		for(var j=0;j<sParticles.length;j++){
			var mParticle = sParticles[j];
			
			mParticle.position.x = mParticle.position.x + (time*mParticle.velocity.x);
			mParticle.position.y = mParticle.position.y + (time*mParticle.velocity.y);
			
			mParticle.life = mParticle.life-time;
			
			if(mParticle.life<=0){
				dead.push(j);
				continue;
			}
			
			mParticle.size = mParticle.size - (time*mParticle.degradeAmt);
			
			if(mParticle.size<=0){
				dead.push(j);
				continue;
			}
		}
		
		for(var j=0;j<dead.length;j++){
			sParticles.splice(dead[j],1);
		}

	}
}

World.prototype.fadeOut = function() {
	
	this.Context.fillStyle = "rgba(0,0,0," +this.fadeOpacity+")"
	this.Context.fillRect(0,0,this.Size.x,this.Size.y);
	if(this.fadeOpacity<1){
		this.fadeOpacity += 0.005;
		return false;	
	}else{
		return true;
	}
}

World.prototype.fadeIn = function() {
	this.Context.fillStyle = "rgba(0,0,0," +this.fadeOpacity+")"
	this.Context.fillRect(0,0,this.Size.x,this.Size.y);
	if(this.fadeOpacity>0){
		this.fadeOpacity = this.fadeOpacity - 0.005;
		return false;
	}else{
		return true;
	}
}

World.prototype.Reset = function() {
	var x = this.currentLevel.startPos.x;
	var y = this.currentLevel.startPos.y;
	this.Player.setPosition(x,y);
	return true;
}

World.prototype.Undo = function() {
	
	var cmd = this.undoStack.pop();
	
	if(cmd=="Obj"){
		mWorld.currentLevel.Objects.pop();
	}else if(cmd=="Obs"){
		mWorld.currentLevel.Obsticles.pop();
	}else if(cmd=="Ext"){
		mWorld.currentLevel.Exits.pop();
	}else if(cmd=="Prt"){
		mWorld.currentLevel.ParticleSystems.pop();	
	}else if(cmd=="Lne"){
		mWorld.currentLevel.Lines.pop();	
	}
		
	mWorld.Player.Controller.resetStatus();
}