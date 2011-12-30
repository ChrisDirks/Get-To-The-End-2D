
var Player = function() {
	
	this.Size = new Vector(10,16);
	this.Controller = new Controller;
	this.Health = 100;
	this.maxHealth = 100;
	this.dmgTime = 0.0;
	this.dmgTimeLimit= 4.5
	this.dmgCooldown = false;
	this.Bounds = {};
	this.Bounds.left;
	this.Bounds.right;
	this.Bounds.top;
	this.Bounds.bottem;
	this.dead = false;
	this.DamageTexts = [];
}

Player.prototype.setPos = function(x,y) {
	this.Controller.Position = new Vector(x,y);
	
	this.updateBounds();
}

Player.prototype.updateBounds = function() {
	
	var xDiff = (this.Size.x/2);
	var yDiff = (this.Size.y/2);
	
	this.Bounds.left = this.Controller.Position.x - xDiff;
	this.Bounds.right = this.Controller.Position.x + xDiff;
	this.Bounds.top = this.Controller.Position.y - yDiff;
	this.Bounds.bottem = this.Controller.Position.y + yDiff;
	
}

Player.prototype.Update = function (fTime) {
	
	if(this.dmgCooldown){
		this.dmgTime = this.dmgTime - fTime;
		if(this.dmgTime <=0){
			this.dmgCooldown = false;
			this.Controller.state = "";
		}
	}
	this.damageUpdate(fTime);
	this.Controller.Update(fTime);
	this.updateBounds();
}

Player.prototype.Render = function (mContext) {
	this.drawPlayer(mContext);
	this.drawDmg(mContext);
}

Player.prototype.setPosition = function (mX,mY) {
	this.Controller.Position = new Vector(mX,mY);
	this.updateBounds();
}

Player.prototype.drawPlayer = function(mContext) {
	
	mContext.fillStyle = "grey";
	mContext.strokeStyle = "white";
	
	var left = this.Controller.Position.x-5;
	var top = this.Controller.Position.y-8;
	
	mContext.fillRect(left,top,10,16);
	mContext.strokeRect(left,top,10,16);
}

Player.prototype.drawDmg = function(mContext) {
	var dmgTexts = this.DamageTexts;
	
	
	
	mContext.font = "6pt Verdana";

	for(var i=0;i<dmgTexts.length;i++){
		var mFade = dmgTexts[i].time/dmgTexts[i].maxTime;
		var mFade = (mFade>=0)? mFade:0;
		mContext.strokeStyle = "rgba(255,0,0,"+ mFade + ")";
		mContext.strokeText(dmgTexts[i].text,dmgTexts[i].Position.x,dmgTexts[i].Position.y);
	}
	
}

Player.prototype.applyDamage = function(val){
	if(this.dmgCooldown)
		return;
		
	this.Health += val;
	
	if(this.Health <= 0){
		this.dead = false;
		return true;
	}
	var dmgTxt = new DamageText(this.Controller.Position.x,this.Bounds.top+5,val);
	this.DamageTexts.push(dmgTxt);
	
	this.dmgTime = this.dmgTimeLimit;
	this.dmgCooldown = true;
	
	return false;
}

var Controller = function() {
	
	this.Position = new Vector();
	this.Velocity = new Vector(0,0);
	this.moveLeft = false;
	this.moveRight = false;
	this.moveSpeed = 0.5;
	this.maxHVelocity = 20;
	this.maxVVelocity = 40;
	this.grounded = false;
	this.jumpHeight = 10;
	this.jumpDist = 0;
	this.collisioneventReset = false;
	this.state = "Falling";
}

Controller.prototype.Update = function(fTime) {
	var pPosition = this.Position;
	var pVelocity = this.Velocity;
	var time = fTime;

	if(pVelocity.y != 0.0){
		this.grounded = false;
	}
	
	if(this.grounded){
		this.Velocity.y = 0.0
	}
	
	if(this.moveRight){
		this.Velocity.x += this.moveSpeed;
		
		if(this.Velocity.x > this.maxHVelocity){
			this.Velocity.x = this.maxHVelocity;
		}		
	}else if(this.moveLeft) {
		this.Velocity.x += -1*this.moveSpeed;
		
		if(Math.abs(this.Velocity.x) > this.maxHVelocity){
			this.Velocity.x = this.maxHVelocity * -1;
		}
	}else{
		this.Velocity.x *= 0.9;
		if(Math.abs(this.Velocity.x)<0.1) {
			this.Velocity.x = 0.0;
		}
	}
	
	if(this.state=="Standing"){
		this.grounded = true;
	}else if(this.state=="Walking"){
		pPosition.x = pPosition.x + (time*pVelocity.x);
		pPosition.y = pPosition.y + (time*pVelocity.y) + (0.5*9.81*Math.pow(time,2));
		
		pVelocity.y = pVelocity.y + (9.81*time);
	}else if(this.state=="Jumping"){
		pPosition.x = pPosition.x + (time*pVelocity.x);
		pPosition.y = pPosition.y + (time*pVelocity.y) + (0.5*9.81*Math.pow(time,2));
		pVelocity.y = pVelocity.y + (9.81*time);
		if(pVelocity.y >= 0){
			this.state = "Falling";
		}
	}else if(this.state=="Falling"){
		pPosition.x = pPosition.x + (time*pVelocity.x);
		pPosition.y = pPosition.y + (time*pVelocity.y) + (0.5*9.81*Math.pow(time,2));
		pVelocity.y = pVelocity.y + (9.81*time);
	}else{
		pPosition.x = pPosition.x + (time*pVelocity.x);
		pPosition.y = pPosition.y + (time*pVelocity.y) + (0.5*9.81*Math.pow(time,2));
		pVelocity.y = pVelocity.y + (9.81*time);
	}
	
	if(this.Velocity.y > this.maxVVelocity){
		this.Velocity.y = this.maxVVelocity;
	}
	
	if(this.grounded){
		if(pVelocity.x != 0.0){
			this.state="Walking";
		}else{
			this.state="Standing";
		}
	}

}

Controller.prototype.Jump = function() {
	
	if(!this.grounded){
		return;
	}
	
	this.Velocity.y = -40;
	
	this.state = "Jumping";
	this.grounded = false;
}

Controller.prototype.resetStatus = function() {
	this.state = "";
	this.Velocity = new Vector(0,0);
	this.moveRight = false;
	this.moveLeft = false;
	this.grounded = false;
}

Player.prototype.Reset = function (){
	this.Health = this.maxHealth;
	this.DamageTexts = [];
	this.dead = false;
	this.Controller.resetStatus();
	return true;
}

Player.prototype.damageUpdate = function (fTime){
	var dmgTexts = this.DamageTexts;
	var deadArray = [];
	for(var i=0;i<dmgTexts.length;i++){
		if(dmgTexts[i].time<=0){
			deadArray.push(i);
			continue;
		}
		dmgTexts[i].Position.y += -0.2;
		dmgTexts[i].time = dmgTexts[i].time-fTime;
	}
	
	for(var i=0;i<deadArray.length;i++){
		dmgTexts.splice(deadArray[i],1);
	}
}

var DamageText = function(x,y,mString){
	this.Position = new Vector(x,y);
	this.text = mString;
	this.time = 20.0;
	this.fade = 1;
	this.maxTime = this.time;
}
