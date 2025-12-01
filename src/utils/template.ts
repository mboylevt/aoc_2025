import { Solution } from './solution';

/**
 * Template showing common patterns for Advent of Code solutions
 * Copy this to src/dayXX/solution.ts and modify as needed
 */

// Example 1: Simple line-by-line string processing
class ExampleStrings extends Solution<string[]> {
  protected parseInput(input: string): string[] {
    return input.split('\n');
  }

  part1(): number {
    // Access lines via this.input
    return this.input.length;
  }

  part2(): number {
    return 0;
  }
}

// Example 2: Parse input as numbers
class ExampleNumbers extends Solution<number[]> {
  protected parseInput(input: string): number[] {
    return input.split('\n').map(Number);
  }

  part1(): number {
    // this.input is now number[]
    return this.input.reduce((sum, n) => sum + n, 0);
  }

  part2(): number {
    return 0;
  }
}

// Example 3: Parse input as a 2D grid
class ExampleGrid extends Solution<string[][]> {
  protected parseInput(input: string): string[][] {
    return input.split('\n').map(line => line.split(''));
  }

  part1(): number {
    const rows = this.input.length;
    const cols = this.input[0]?.length || 0;
    return rows * cols;
  }

  part2(): number {
    return 0;
  }
}

// Example 4: Parse input into a custom data structure
interface Instruction {
  command: string;
  value: number;
}

class ExampleCustom extends Solution<Instruction[]> {
  protected parseInput(input: string): Instruction[] {
    return input.split('\n').map(line => {
      const [command, valueStr] = line.split(' ');
      return { command, value: parseInt(valueStr) };
    });
  }

  part1(): number {
    return this.input.filter(i => i.value > 0).length;
  }

  part2(): number {
    return 0;
  }
}

// Example 5: Parse input with sections separated by blank lines
class ExampleSections extends Solution<string[][]> {
  protected parseInput(input: string): string[][] {
    return input.split('\n\n').map(section => section.split('\n'));
  }

  part1(): number {
    return this.input.length;
  }

  part2(): number {
    return 0;
  }
}
