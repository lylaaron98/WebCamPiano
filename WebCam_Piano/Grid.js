
var monoSynth=new p5.MonoSynth();

class Grid {
  /////////////////////////////////
  constructor(_w, _h) {
    this.gridWidth = _w;
    this.gridHeight = _h;
    this.noteSize = 40;
    this.notePos = [];
    this.noteState = [];

    // initalise grid structure and state
    for (var x=0;x<_w;x+=this.noteSize){
      var posColumn = [];
      var stateColumn = [];
      for (var y=0;y<_h;y+=this.noteSize){
        posColumn.push(createVector(x+this.noteSize/2,y+this.noteSize/2));
        stateColumn.push(0);
      }
      this.notePos.push(posColumn);
      this.noteState.push(stateColumn);
    }
      print(posColumn);
  }
  
  /////////////////////////////////
  run(img) {
    img.loadPixels();
    this.findActiveNotes(img);
    this.drawActiveNotes(img);
  }
  /////////////////////////////////
  drawActiveNotes(img){
    // draw active notes
    fill(255);
    noStroke();
    for (var i=0;i<this.notePos.length;i++){
      for (var j=0;j<this.notePos[i].length;j++){
        var x = this.notePos[i][j].x;
        var y = this.notePos[i][j].y;
        if (this.noteState[i][j]>0) {
          var alpha = this.noteState[i][j] * 200;
          var c1 = color(255,0,0,alpha);
          var c2 = color(0,255,0,alpha);
          var mix = lerpColor(c1, c2, map(i, 0, this.notePos.length, 0, 1));
          fill(mix);
          var s = this.noteState[i][j];
          ellipse(x, y, this.noteSize*s, this.noteSize*s);
          playSynthMovement();
        }
        this.noteState[i][j]-=0.05;
        this.noteState[i][j]=constrain(this.noteState[i][j],0,1);
      }
    }
  }
  /////////////////////////////////
  findActiveNotes(img){
    for (var x = 0; x < img.width; x += 1) {
        for (var y = 0; y < img.height; y += 1) {
            var index = (x + (y * img.width)) * 4;
            var state = img.pixels[index + 0];
            if (state==0){ // if pixel is black (ie there is movement)
              // find which note to activate
              var screenX = map(x, 0, img.width, 0, this.gridWidth);
              var screenY = map(y, 0, img.height, 0, this.gridHeight);
              var i = int(screenX/this.noteSize);
              var j = int(screenY/this.noteSize);
			 
              // everytime it runs when random(0,n) has a value more than 95
              // run the sparkle effect on both sides
              var n = 100;
              if(random(0,n) >= 95){
                push();
                var sparkle = {
                  locationX: random(width),
                  locationY: random(height),
                  size: random(1, 6)
                }
                fill (255);
                noStroke();
                //using properties in sparkle create small circles to look like sparkles.
                ellipse(sparkle.locationX, sparkle.locationY, sparkle.size, sparkle.size);
                pop();
              }
              this.noteState[i][j] = 1;
              
            }
        }
    }
  }
}

function preload()
{
	sound = loadSound('assets/piano.mp3');
}

//function to play sound notes on random upon movement
function playSynthMovement()
{
	userStartAudio();
	
	let note = random(['F4', 'G4']);
	let velocity = random();
	let time = 0;
	let dur = 1/6;

	
	monoSynth.play(note, velocity, time, dur);
}

//function to play mp3 sound file
function playSynthClick()
{
	userStartAudio();
	
	let note = random(['sound']);
	let velocity = random();
	let time = 0;
	let dur = 1/6;
	sound.play();
	
	monoSynth.play(note, velocity, time, dur);
}

//Left mouse click plays 'piano.mp3' file

function mousePressed() 
{
  playSynthClick();
  
}

