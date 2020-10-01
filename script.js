/**
 * settings you cant mess with
 */
  var canvas = document.querySelector("canvas"),
      context = canvas.getContext("2d"),
      offscreen = document.querySelector(".offscreen"),
      offscreenContext = offscreen.getContext("2d"),
      width = 1000,
      height = 500,
      boids;

/**
 * Adjustments that affect how the boids flock
 */
var numBoids = 300,
    flockmateRadius = 60,
    separationDistance = 30,
    maxVelocity = 2,
    separationForce = 0.03,
    alignmentForce = 0.03,
    cohesionForce = 0.03;
    offscreenContext.globalAlpha = 0.95; // boid tail length

/**
 * Event listener (click near boids to add friends)
 */ 
d3.select("canvas").on("click", function () {
  console.info("click");
  var xy = d3.mouse(this);
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      boids.push({
        color: d3.interpolateRainbow((boids.length / 10) % 1),
        position: new Vec2(xy[0], xy[1]),
        velocity: randomVelocity(),
        last: [],
      });
    }, 50);
  }
});

restart(); // Clear / generate boids
requestAnimationFrame(tick); // start the main loop

/**
 * Infinite loop which updates each boids location
 */ 
function tick() {
  offscreenContext.clearRect(0, 0, width, height);
  offscreenContext.drawImage(canvas, 0, 0, width, height);
  context.clearRect(0, 0, width, height);
  context.drawImage(offscreen, 0, 0, width, height);
  boids.forEach(function (b) {
    var forces = {
      alignment: new Vec2(),
      cohesion: new Vec2(),
      separation: new Vec2(),
    };
    b.acceleration = new Vec2();
    boids.forEach(function (b2) {
      if (b === b2) return;
      var diff = b2.position.clone().subtract(b.position),
        distance = diff.length();
      if (distance && distance < separationDistance) {
        forces.separation.add(
          diff.clone().scaleTo(-1 / distance)
        ).active = true;
      }
      if (distance < flockmateRadius) {
        forces.cohesion.add(diff).active = true;
        forces.alignment.add(b2.velocity).active = true;
      }
    });
    for (var key in forces) {
      if (forces[key].active) {
        forces[key]
          .scaleTo(maxVelocity)
          .subtract(b.velocity)
          .truncate(window[key + "Force"]);
        b.acceleration.add(forces[key]);
      }
    }
    b.last.push(
      b.acceleration.length() /
        (alignmentForce + cohesionForce + separationForce)
    );
    if (b.last.length > 20) {
      b.last.shift();
    }
  });
  boids.forEach(updateBoid);
  requestAnimationFrame(tick);
}

/**
 * Updates the position / color of each boid
 * @param {boid} b
 * @returns void
 */
function updateBoid(b) {
  b.position.add(b.velocity.add(b.acceleration).truncate(maxVelocity));
  if (b.position.y > height) {
    b.position.y -= height;
  } else if (b.position.y < 0) {
    b.position.y += height;
  }
  if (b.position.x > width) {
    b.position.x -= width;
  } else if (b.position.x < 0) {
    b.position.x += width;
  }
  context.beginPath();
  context.fillStyle = d3.interpolateWarm(d3.mean(b.last) * 2);
  context.arc(b.position.x, b.position.y, 2, 0, 2 * Math.PI);
  context.fill();
}

/**
 * Clears the screen of boids and generates new boids
 */
function restart() {
  offscreenContext.clearRect(0, 0, width, height);
  context.clearRect(0, 0, width, height);
  boids = window["initializeRandom"]();
  boids.forEach(function (b, i) {
    b.color = d3.interpolateRainbow(i / numBoids);
    b.last = [];
  });
}

/**
 * Simple position randomizer
 */
function initializeRandom() {
  return d3.range(numBoids).map(function (d, i) {
    return {
      position: new Vec2(Math.random() * width, Math.random() * height),
      velocity: randomVelocity(),
    };
  });
}

/**
 * Simple velocity randomizer
 */
function randomVelocity() {
  return new Vec2(1 - Math.random() * 2, 1 - Math.random() * 2).scale(
    maxVelocity
  );
}
