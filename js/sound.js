function Sound(source, level) {
  this.source = source;
  this.buffer = null;
  this.isLoaded = false;
  this.volume = audioContext.createGain();

  if (!level) {
    this.volume.gain.value = 4;
  } else {
    this.volume.gain.value = level;
  }

  var getSound = new XMLHttpRequest();
  getSound.open("GET", this.source, true); 
  getSound.responseType = "arraybuffer";

  var that = this;
  getSound.onload = function() {
    audioContext.decodeAudioData(getSound.response, function (buffer) {
      that.buffer = buffer;
      that.isLoaded = true;
    });
  }
  getSound.send();
}

Sound.prototype.play = function() {
  if (this.isLoaded === true) {
    var playSound = audioContext.createBufferSource();
    playSound.buffer = this.buffer;

    playSound.connect(this.volume);
    this.volume.connect(audioContext.destination);
    playSound.start(0);
  }
}

Sound.prototype.setVolume = function(level) {
  this.volume.gain.value = level;
}
