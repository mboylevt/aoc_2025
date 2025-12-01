import { Solution } from '../utils/solution';

class Day01 extends Solution<string[]> {
  /**
   * Parse input - override this if you need a different format
   * Default splits on newlines, which works for this puzzle
   */
  protected parseInput(input: string): string[] {
    return input.split('\n');
  }

  part1(): number {
    // TODO: Implement part 1 solution
    // Example: this.input is an array of strings (one per line)
    let currentPosition = 50
    let zeroCounter = 0

    this.input.forEach(move => {
      let dir = move.slice(0, 1);
      let distance = +move.slice(1);

      if (dir == 'R') {
        currentPosition = (currentPosition + distance) % 100;
      }
      else {
        currentPosition = ((currentPosition - distance) % 100 + 100) % 100;
      }
      if (currentPosition == 0) {
        zeroCounter++;
      }
    });
    console.log(zeroCounter);

    return zeroCounter;
  }

  part2(): number {
    let currentPosition = 50;
    let zeroCounter = 0;

    this.input.forEach(move => {
      let dir = move.slice(0, 1);
      let distance = +move.slice(1);

      // Count passes through 0 DURING rotation (not including final position)
      if (dir === 'R') {
        zeroCounter += Math.floor((currentPosition + distance - 1) / 100)
          - Math.floor(currentPosition / 100);
      } else {
        if (currentPosition === 0) {
          zeroCounter += Math.floor((distance - 1) / 100);
        } else if (currentPosition <= distance - 1) {
          zeroCounter += Math.floor((distance - 1 - currentPosition) / 100) + 1;
        }
      }

      // Update position
      currentPosition = dir === 'R'
        ? (currentPosition + distance) % 100
        : ((currentPosition - distance) % 100 + 100) % 100;

      // Also count if we LAND on 0 (this was counted in part1)
      if (currentPosition === 0) {
        zeroCounter++;
      }
    });

    return zeroCounter;
  }
}

// Run the solution
new Day01(1).run();
