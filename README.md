### Ever wonder how birds know where to fly when in a giant flock?
How do they decide where to go, and how does the flock make it to their destination? Is there an "alpha bird" that tells them where to fly?

The following experiment uses D3 to generate simulated birds. It turns out birds follow 3 simple instructions. I created an infinite loop to simulate time, and each "tick" each bird makes a decision and moves following these three rules:
1. Each bird aims for the center of the flock
2. Each bird avoids colliding with other birds
3. Try to match your velocity to the velocity of the other birds

Thats all it takes to fly like a bird
[>>Click here for Demo <<](https://gyro851.github.io/js-boids-experiment/index.html)
