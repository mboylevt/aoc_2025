import { Solution } from '../utils/solution';

function createStartArray(stringInput: string[]) {
  let returnArray: string[][] = [];
  stringInput.forEach(row => {
    returnArray.push(row.split(''))
  })
  return returnArray
}

class Day07 extends Solution<string[]> {
  part1(): number {
    // Initialize
    let splits = 0;
    let input = createStartArray(this.input);
    let beams = new Set<number>;

    // Add the starting beam to the beam set
    beams.add(+input[0].indexOf('S'))

    // Iterate over rows, tracking splits
    input.slice(1).forEach(row => {
      beams.forEach(beam => {
        // if a beam hits a splitter, remove it from the set and add its splits
        if (row[beam] == '^') {
          splits++;
          beams.delete(beam);
          beams.add(beam + 1);
          beams.add(beam - 1);
        }
      })
    });

    return splits;
  }

  part2(): number {
    // Initialize
    let input = createStartArray(this.input);
    let timelines = new Map<number, number>();

    // Add starting timeline
    timelines.set(input[0].indexOf('S'), 1);

    // Process each row after the start
    input.slice(1).forEach(row => {
      let newTimelines = new Map<number, number>();

      // For each position with timelines
      for (let [pos, count] of timelines.entries()) {
        if (row[pos] === '^') {
          // Splitter: each timeline splits into 2 (left and right)
          newTimelines.set(pos - 1, (newTimelines.get(pos - 1) || 0) + count);
          newTimelines.set(pos + 1, (newTimelines.get(pos + 1) || 0) + count);
        } else {
          // No splitter: timelines continue straight down
          newTimelines.set(pos, (newTimelines.get(pos) || 0) + count);
        }
      }
      timelines = newTimelines;
    })

    // Sum up all timelines across all final positions
    let total = 0;
    for (let count of timelines.values()) {
      total += count;
    }

    return total;
  }
}

// Run the solution
new Day07(7).run();
