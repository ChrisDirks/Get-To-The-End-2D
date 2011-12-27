
var Player = function() {
	
	this.Size = new Vector(10,16);
	this.Controller = new Controller;
	this.Bounds = {};
	this.Bounds.left;
	this.Bounds.right;
	this.Bounds.top;
	this.Bounds.bottem;
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
	this.grounded = false;
} 
