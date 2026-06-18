// Backgroundglow.js
// p5 instance mode so it will not conflict with the hypercube sketch

const backgroundSketch = (p) => {
  const NUM_MOVERS = 20;
  const CONNECTION_DISTANCE = 120;

  // Axon-inspired palette
  const AXON_CORE = [155, 163, 220];
  const AXON_MID = [106, 114, 174];
  const AXON_OUTER = [66, 78, 139];
  const AXON_LINE = [36, 53, 109];

  let movers = [];

  p.setup = function () {
    const cnv = p.createCanvas(p.windowWidth, p.windowHeight);
    cnv.id("background-canvas");
    p.pixelDensity(1);

    for (let i = 0; i < NUM_MOVERS; i++) {
      movers.push(new Mover(p));
    }
  };

  p.draw = function () {
    // Transparent canvas: keeps your original page background visible
    p.clear();

    // Draw connecting axon lines first
    p.strokeWeight(1);
    for (let i = 0; i < movers.length; i++) {
      for (let j = i + 1; j < movers.length; j++) {
        const d = p.dist(
          movers[i].position.x,
          movers[i].position.y,
          movers[j].position.x,
          movers[j].position.y
        );

        if (d < CONNECTION_DISTANCE) {
          const alpha = p.map(d, 0, CONNECTION_DISTANCE, 70, 0);
          p.stroke(AXON_LINE[0], AXON_LINE[1], AXON_LINE[2], alpha);

          p.line(
            movers[i].position.x,
            movers[i].position.y,
            movers[j].position.x,
            movers[j].position.y
          );
        }
      }
    }

    // Draw particles
    p.noStroke();
    for (const mover of movers) {
      mover.update();
      mover.checkEdges();
      mover.display();
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  class Mover {
    constructor(p5ref) {
      this.p = p5ref;

      this.position = this.p.createVector(
        this.p.random(this.p.width),
        this.p.random(this.p.height)
      );
      this.velocity = this.p.createVector(0, 0);
      this.acceleration = this.p.createVector(0, 0);

      // Each dot moves a little differently
      this.mouseForce = this.p.random(0.003, 0.012);
      this.maxSpeed = this.p.random(0.35, 1.1);
      this.drift = p5.Vector.random2D().mult(this.p.random(0.001, 0.005));
      this.phase = this.p.random(this.p.TWO_PI);
      this.wobble = this.p.random(0.0008, 0.004);
    }

    update() {
      const p = this.p;
      const force = p.createVector(0, 0);

      // Soft mouse attraction, only when the mouse is on the page
      if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
        const mouse = p.createVector(p.mouseX, p.mouseY);
        const dir = p5.Vector.sub(mouse, this.position);
        dir.normalize();
        dir.mult(this.mouseForce);
        force.add(dir);
      }

      // Unique drift so particles do not bunch together
      force.add(this.drift);

      // Tiny wobble for a living neural feel
      force.add(
        p.createVector(
          p.sin(p.frameCount * 0.01 + this.phase) * this.wobble,
          p.cos(p.frameCount * 0.013 + this.phase) * this.wobble
        )
      );

      this.acceleration = force;
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      this.position.add(this.velocity);
    }

    display() {
      const p = this.p;

      // outer glow
      p.fill(AXON_OUTER[0], AXON_OUTER[1], AXON_OUTER[2], 18);
      p.ellipse(this.position.x, this.position.y, 18, 18);

      // mid glow
      p.fill(AXON_MID[0], AXON_MID[1], AXON_MID[2], 50);
      p.ellipse(this.position.x, this.position.y, 10, 10);

      // bright core
      p.fill(AXON_CORE[0], AXON_CORE[1], AXON_CORE[2], 150);
      p.ellipse(this.position.x, this.position.y, 4, 4);
    }

    checkEdges() {
      const p = this.p;

      if (this.position.x > p.width) this.position.x = 0;
      else if (this.position.x < 0) this.position.x = p.width;

      if (this.position.y > p.height) this.position.y = 0;
      else if (this.position.y < 0) this.position.y = p.height;
    }
  }
};

new p5(backgroundSketch);