
function Memory (args) {
  this.id = args.id;
  this.sound = new Sound("audio/" + args.audioFile);
  this.bpm = args.bpm;
  this.createdAt = args["created_at"];

  // Manejar el created_at
  var radius = 50;

  var material = new THREE.SpriteCanvasMaterial({
    color: "rgb(226, 7, 33)",
    opacity: 1,
    program: programStroke
  });

  this.particle = new THREE.Sprite(material);
  this.particle.position.y = Math.random() * 2 - 1;
  this.particle.position.z = Math.random() * 2 - 1;
  this.particle.position.x = Math.random() * 2 - 1;
  this.particle.position.normalize();
  this.particle.position.multiplyScalar(radius);
  this.particle.scale.x = this.particle.scale.y = Math.random() * 15 + 15;
}