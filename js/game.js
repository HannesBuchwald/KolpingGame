// Author: Hannes Buchwald
// Version: 1.0
// Letze Aenderung: 17.02.2017


var mainState = {


	// Diese Funktion wird von Pahser aufgerufen
	// Vor dem Spiel werden alle Rechenintensive Operationen
	// wie laden von Bilder und Sound in den Speicher vorgenommen.
	preload: function() { 

		// Grafiken werden in den Speicher geladen
	    game.load.image('background', 'images/background.png');	   
	    game.load.image('spaceShip', 'images/spaceShip.png');
	    game.load.image('asterorid', 'images/asteorid.png');

		// Sounds werden in den Speicher geladen
	    game.load.audio('jump', 'sounds/jump.mp3'); 
	    game.load.audio('smashing', 'sounds/crash.mp3'); 
	    game.load.audio('add', 'sounds/add.mp3'); 

	    // Aenderung der Hintergundfarbe
	    // game.stage.backgroundColor = '#71c5cf'; 
	},


	// Diese Funktion wird von Pahser aufgerufen
	// Hier wird die Spielelogik beschrieben
	create: function() { 	
	    

	    // Game Physik
	    game.physics.startSystem(Phaser.Physics.ARCADE);


	    /*********  Grafik Objekte *********/

	    // Erstelle das Hintergundbild an Position x=0 y=0
		game.add.sprite(0, 0, 'background');

	    // Erstelle die Spielfigur an Position x=100 y=245
	    this.spaceShip = game.add.sprite(100, 245, 'spaceShip');

	    // Aktivie die Physik der Spielfigur 
	    game.physics.arcade.enable(this.spaceShip);

 		// Verschiebe den Scherpunkt der Spielfigur nach links und nach untern
		this.spaceShip.anchor.setTo(-0.2, 0.5); 

	

		// Erstelle eine Asteorierdengruppe
		// darin werden alle einzelne Asteorierden zusammengefügt
		// Diese Gruppe wird für die Kollision mit der Spielfigur benötigt
		this.asterorids = game.add.group(); 
 
		// Erstelle eine Zeit Variable
		// Über dieses Variable wird weiter unter definiert
		// wie oft die "Asteoriedenwand" erstellt wird
 		this.timer;




 		/******** Text Objecte **********/

 		// Highscore
		this.score = -1;
		this.labelScore = game.add.text(20, 20, "0", 
    		{ font: "30px Arial", fill: "#ffffff" });  


		// Start Text
		// Dieser wird nur am Anfang gezeigt um dem Spieler aufzufordern
		// das Game zu beginnen.
		this.startText = game.add.text(50, 200, "press space to start",
    		{ font: "30px Arial", fill: "#ffffff" }); 



		/************** Sounds **************/

		// Dieser Sound wird beim Springen abgespielt
		this.jumpSound = game.add.audio('jump');

		// Dieser Sound wird beim einer Kollision abgespielt
 		this.smashingSound = game.add.audio('smashing');

 		// Dieser Sound wird für das zählen des HighScores abgespielt
		this.addSound = game.add.audio('add');



		/************ Input ***********/

	    // Immer wenn die Leertaste gedrückt wird,
	    // wird die Funktion jump ausgeführt.
	    var spaceKey = game.input.keyboard.addKey(
	                    Phaser.Keyboard.SPACEBAR);
	    spaceKey.onDown.add(this.jump, this);


	    this.start = true;

	    // Dieser Input "hört" auf einen Mausklick oder
	    // auf einen Touch click eines Touchpads.
	    // Hier wird auch die jump Funktion bei einem Click ausgelöst.
	    game.input.onDown.add(this.jump, this);

	},



	// Diese Funktion wird mit 60fps von Pahser aufgerufen
	update: function() {
	    
	    // Überprüfung ob das Spaceship noch im Spielfeld ist.
	    // Wenn nicht kommt es zum Neustart
	    if (this.spaceShip.y < 0 || this.spaceShip.y > 490)
	        this.restartGame();

	    // Hier wird der Winkel des SpaceShips bis max 20 Grad nach unten geneigt 
    	if (this.spaceShip.angle < 20) {
    		this.spaceShip.angle += 1;
    	} 

    	// Kollistions Überprüfung
    	// Bei einer Kollision wird die Funktion hitasteorid ausgeführt
	    game.physics.arcade.overlap(
    	this.spaceShip, this.asterorids, this.hitAsterorid, null, this);

	},


	// Neustart
	restartGame: function() {

	    // Start the 'main' state, which restarts the game
	    game.state.start('main');
	},





	// Springen des Spaceships
	// und inizieren des Starts
	jump: function() {
	    
	    // Beim ersten drücken der Leertaste oder der Maus "beginnt" das Spiel
	    // Diese Schleife wird nur einmal ausgehführt
		if(this.start){
			this.start = false;
			this.spaceShip.body.gravity.y = 1000;  
			this.startText.text = "";
			this.timer  = game.time.events.loop(1500, this.addRowOfAterorids, this); 
			return;
		} 


	    // Geschwindigkeit des SpaceShips in Y Richtung mit -350,
	    // also nach oben
	    this.spaceShip.body.velocity.y = -350;

	    // Erstelle eine Animation des Spaceships 
		var animation = game.add.tween(this.spaceShip);

		// Aendere den Winkel des SpaceShip zu -20° in 100 milliseconds
		animation.to({angle: -20}, 100);

		// Starte Animation
		animation.start(); 

		// Abspielen des "Jump" Sounds
		this.jumpSound.play(); 
	},



	// Diese Funktion wird beim kolliedieren des Spaceships
	// mit den Asteorieden aufgerufen. 
	// Die Asteoriedenbewegung und die Eingabemöglichkeit werden gestoppt.
	hitAsterorid: function() {

	    // Wenn das Spaceship mit dem Asteorieden schon kollidiert ist, 
	    // wird die Funktion abgebrochen.
    	if (this.spaceShip.alive == false) {
    		return;
    	}

    	// Kollisions Sound wird abgespielt 
    	this.smashingSound.play(); 

    	// Set the alive property of the spaceShip to false
    	this.spaceShip.alive = false;

	    // Stopt das Erstellen neuer Asteorieden
	    game.time.events.remove(this.timer);

	    // Gehe durch die ganze Asteoriedengruppe und stoppe 
	    // die Geschwindigkeit in X Richtung 
	    this.asterorids.forEach(function(p){
	        p.body.velocity.x = 0;
	    }, this);

	    // "Game Over" wird angezeigt bei x=35 y200
	    game.add.text(35, 200, "GAME OVER",
    		{ font: "50px Arial", fill: "#ffffff" }); 

	    // Hoere nicht mehr auf Keyboard und Mouse Input
    	game.input.keyboard.removeKey(
    		Phaser.Keyboard.SPACEBAR);
		game.input.onDown.removeAll();

	}, 


	// Asterodienwand wird erstellt
	addRowOfAterorids: function() {
	    
	    // Ersetlle eine Zufallszahl von 1-5
	    // Das ist die Zahl für die Positionen der Loecher in der Mauer
	    var hole = Math.floor(Math.random() * 5) + 1;

	    // Erstelle die einzelnen Asteorierden der Asteoriedenwand
	    // Ausser die für das "Loch"
	    for (var i = 0; i < 8; i++) {
	        if (i != hole && i != hole + 1 && i != hole + 2)  {
	            this.addOneaterorid(400, i * 60 + 10);   
	    	}
	    }

	    // Zähle Highscore um 1 nach oben
	    this.score += 1;
		this.addSound.play(); 

	    // Zeichen neuen Highscore im Spielfeld
		this.labelScore.text = this.score;    
	},


	// Erstelle ein einzelnen Asteorierden an Position x und y
	addOneaterorid: function(x, y) {
	    
	    // Erstelle ein Asteoriedenobjekt an mitgegebener Position
	    var asterorid = game.add.sprite(x, y, 'asterorid');

	    // Füge den Asteorieden der Asteoriedengruppe hinzu
	    this.asterorids.add(asterorid);

	    // Aktiviere Physik für den Asteorieden
	    game.physics.arcade.enable(asterorid);

	    // Bewege den Asteorieden nach Links in X Richting mit -200
	    asterorid.body.velocity.x = -200; 

	    // Wenn der Asteoried nicht mehr im Spielfeld ist wird er gelöscht
	    asterorid.checkWorldBounds = true;
	    asterorid.outOfBoundsKill = true;
	},
};


// Iniziieren Phaser mit einer Spielfeldgröße von 400, 490
// Erstelle das Game in das Div mit der ID "GameDiv".
var game = new Phaser.Game(400, 490, Phaser.AUTO,'GameDiv');

// Füge dem Spiel ein State und nenne Ihn "main"
// Diesen "State" haben wir oben beschrieben
game.state.add('main', mainState); 

// Starte den State
// Also Starte das Spiel
game.state.start('main');