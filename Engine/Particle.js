
var ParticleSystem = function() {
	this.particleType;
	this.Particles = [];
	this.position;
	this.maxParticles;
	this.degradeRange;
	this.velocityY;
	this.velocityX;
	this.sizeRange;
	this.lifeRange;
	this.color;
	this.Area;
	this.delay=0;
	this.emitAmt=0;
	this.emitTime=0;
	this.oneShot = false;
}

var Particle = function(mtype,msize,mcol,mpos,mvel,mlife,mdeg) {
	this.type = mtype;
	this.position = mpos;
	this.color = 
	this.size = msize;
	this.life = mlife;
	this.velocity = mvel;
	this.degradeAmt = mdeg;
}

ParticleSystem.prototype.Render = function(mContext) {
	this.drawParticles(mContext);
}

ParticleSystem.prototype.drawParticles = function(mContext) {
	
	var sParticles = this.Particles;
		
	mContext.strokeStyle = this.color;
	mContext.fillStyle = this.color;
			
	for(var j=0;j<sParticles.length;j++){
		var mParticle = sParticles[j];
		var pSize = mParticle.size;
		var pType = mParticle.type;
		var pPos = mParticle.position;
			
		if(mParticle.size<=0){
			continue;
		}
			
		if(pType == 0){
			mContext.beginPath();
			mContext.arc(pPos.x, pPos.y, pSize,
				0, 6.28, false);
			mContext.closePath();
			mContext.fill();
			//mContext.stroke();
		}
	}
}


ParticleSystem.prototype.generateParticle = function() {
	var pAreaX = this.Area.x;
	var pAreaY = this.Area.y;
	
	var pVelX = this.velocityX;
	var pVelY = this.velocityY;
	
	var pSize = this.sizeRange;
	
	var pDegrade = this.degradeRange;
	
	var pLife = this.lifeRange;
	
	var pType = this.particleType;
	
	var pX = (Math.floor(Math.random()*(pAreaX*2))-pAreaX)+this.position.x;
	var pY = (Math.floor(Math.random()*(pAreaY*2))-pAreaY)+this.position.y;
	
	if(pVelX.x>=0){
		var pvX = Math.floor(Math.random()*(pVelX.y-pVelX.x))+pVelX.x;
	}else{
		var pvX = Math.floor(Math.random()*(pVelX.y-pVelX.x))- Math.abs(pVelX.x);
	}
	
	if(pVelX.x>=0){
		var pvY = Math.floor(Math.random()*(pVelY.y-pVelY.x))+pVelY.x;
	}else{
		var pvY = Math.floor(Math.random()*(pVelY.y-pVelY.x))-Math.abs(pVelY.x);
	}
	
	var pvY = Math.floor(Math.random()*(pVelY.y-pVelY.x))+pVelY.x;
	
	var pS = Math.random()*(pSize.y-pSize.x)+pSize.x;
	
	var pD = Math.random()*(pDegrade.y-pDegrade.x)+pDegrade.x;
	
	var pL = Math.floor(Math.random()*(pLife.y-pLife.x))+pLife.x;
	
	var pVelocity = new Vector(pvX,pvY);
	var pPosition = new Vector(pX,pY);
	
	var nParticle = new Particle(pType,pS,this.color,pPosition,pVelocity,pL,pD);
	
	this.Particles.push(nParticle);
}
