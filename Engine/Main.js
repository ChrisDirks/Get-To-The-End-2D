var mWorld;

var Init = function(Canvas) {
	
	mWorld = new World(Canvas);
	
	setupLevels();
	
	setupLevelGenTools(true);
	
	updateDebugOpt();
	
	addPS();
	
	mWorld.status = "init";
	
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

var addPS = function() {
	//var nTB = new TextBox("W & D To Move",200,200,100,30,"white");

	//mWorld.currentLevel.TextBoxes.push(nTB);
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