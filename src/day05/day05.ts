import { Solution } from '../utils/solution';

class Day05 extends Solution<string[]> {
  part1(): number {
    let inputValues = this.input;

    let ranges: Array<[number, number]> = [];
    let freshCount = 0;

    let rangesArray = inputValues.slice(0, inputValues.indexOf(''));
    let valuesArray = inputValues.slice(inputValues.indexOf('') + 1);

    // Parse ranges
    rangesArray.forEach(row => {
      let start = +(row.slice(0, row.indexOf('-')));
      let end = +(row.slice(row.indexOf('-') + 1));
      ranges.push([start, end]);
    });

    // Check if each value falls within any range
    valuesArray.forEach(num => {
      const value = +(num);
      const inRange = ranges.some(([start, end]) => value >= start && value <= end);
      if (inRange) {
        freshCount++;
      }
    });

    return freshCount;
  }

  part2(): number {
    let inputValues = this.input;

    let ranges: Array<[number, number]> = [];
    let rangesArray = inputValues.slice(0, inputValues.indexOf(''));

    // Parse ranges
    rangesArray.forEach(row => {
      let start = +(row.slice(0, row.indexOf('-')));
      let end = +(row.slice(row.indexOf('-') + 1));
      ranges.push([start, end]);
    });

    // Sort ranges by start position
    ranges.sort((a, b) => a[0] - b[0]);

    // Merge overlapping ranges
    const merged: Array<[number, number]> = [];
    for (const [start, end] of ranges) {
      if (merged.length === 0) {
        merged.push([start, end]);
      } else {
        const last = merged[merged.length - 1];
        // Check if current range overlaps or touches the last merged range
        if (start <= last[1] + 1) {
          // Merge: extend the last range's end if needed
          last[1] = Math.max(last[1], end);
        } else {
          // No overlap, add as new range
          merged.push([start, end]);
        }
      }
    }

    // Count total IDs in merged ranges
    let totalCount = 0;
    for (const [start, end] of merged) {
      totalCount += end - start + 1;
    }

    return totalCount;
  }
}

// Run the solution
new Day05(5).run();
