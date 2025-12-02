import { Solution } from '../utils/solution';

class Day02 extends Solution<string[]> {
  /**
   * Parse input - override this if you need a different format
   * Default splits on newlines, which works for this puzzle
   */
  protected parseInput(input: string): string[] {
    return input.split(',');
  }

  part1(): number {
    let invalidIds: number = 0;
    this.input.forEach(range => {
      let rangeInt = range.split('-');
      for (let i = +rangeInt[0]; i <= +rangeInt[1]; i++) {
        let t_str = i.toString()
        if (t_str.length % 2 != 0) { continue; }
        let first_half = t_str.slice(0, t_str.length / 2)
        let second_half = t_str.slice(t_str.length / 2)
        if (first_half == second_half) { invalidIds += i }
      }
    });
    return invalidIds
  }

  /**
   * Check if a number is made of a pattern repeated at least twice
   */
  private isInvalidId(n: number): boolean {
    const s = n.toString();
    const length = s.length;

    // Try each possible pattern length (must repeat at least twice)
    for (let patternLen = 1; patternLen <= Math.floor(length / 2); patternLen++) {
      if (length % patternLen === 0) {  // Pattern must divide evenly
        const pattern = s.slice(0, patternLen);
        if (pattern[0] !== '0') {  // No leading zeros
          const repetitions = length / patternLen;
          if (pattern.repeat(repetitions) === s) {
            return true;
          }
        }
      }
    }
    return false;
  }

  part2(): number {
    let invalidIds: number = 0;
    this.input.forEach(range => {
      const rangeInt = range.split('-');
      for (let i = +rangeInt[0]; i <= +rangeInt[1]; i++) {
        if (this.isInvalidId(i)) {
          invalidIds += i;
        }
      }
    });
    return invalidIds;
  }
}

// Run the solution
new Day02(2).run();
