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
var CreateWorkers = function (workerNum,workerDataLoc,_Func) {
  	
  	worker_num = workerNum;
  	var worker = new Array; 
  	
  	if(!worker_num){
  		console.log("No workers created");
  		return;
  	}
  
  	for (var i=0;i<worker_num;i++) {
  		worker[i] = new Worker(workerDataLoc);
  		worker[i].addEventListener('message', function(e){_Func(e);},false);
  	}
  	
  	return worker;
}
 
var DestroyWorkers = function (workers) {
  	for (var i=0;i<workers.length;i++) {
  		workers[i].terminate();
  	}
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