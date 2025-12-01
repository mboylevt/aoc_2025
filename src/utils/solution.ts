import { readInput, readInputTest } from './readInput';

/**
 * Abstract base class for Advent of Code solutions
 *
 * To create a solution for a day:
 * 1. Extend this class
 * 2. Implement parseInput() to transform raw input into your preferred format
 * 3. Implement part1() and part2() with your solution logic
 * 4. Call run() to execute both parts
 */
export abstract class Solution<T = string[]> {
  protected day: number;
  protected rawInput: string;
  protected rawInputTest: string;
  protected input: T;
  protected inputTest: T;

  constructor(day: number) {
    this.day = day;
    this.rawInput = readInput(day);
    this.rawInputTest = readInputTest(day);
    this.input = this.parseInput(this.rawInput);
    this.inputTest = this.parseInput(this.rawInputTest);
  }

  /**
   * Parse the raw input string into whatever format you need
   * Default implementation splits on newlines
   * Override this to parse into numbers, grids, etc.
   */
  protected parseInput(input: string): T {
    return input.split('\n') as T;
  }

  /**
   * Solve part 1 of the puzzle
   */
  abstract part1(): number | string;

  /**
   * Solve part 2 of the puzzle
   */
  abstract part2(): number | string;

  /**
   * Run both parts and display results with timing
   */
  run(): void {
    console.log(`\n=== Day ${this.day} ===\n`);

    // Part 1
    const start1 = performance.now();
    const result1 = this.part1();
    const time1 = (performance.now() - start1).toFixed(2);
    console.log(`Part 1: ${result1} (${time1}ms)`);

    // Part 2
    const start2 = performance.now();
    const result2 = this.part2();
    const time2 = (performance.now() - start2).toFixed(2);
    console.log(`Part 2: ${result2} (${time2}ms)`);

    console.log();
  }
}
