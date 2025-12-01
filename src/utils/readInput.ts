import * as fs from 'fs';
import * as path from 'path';

/**
 * Reads the input file for a given day
 * @param day - The day number (e.g., 1 for day01)
 * @returns The contents of the input file as a string
 */
export function readInput(day: number): string {
  const dayStr = day.toString().padStart(2, '0');
  const inputPath = path.join(__dirname, '../../inputs', `day${dayStr}.txt`);
  return fs.readFileSync(inputPath, 'utf-8').trim();
}

/**
 * Reads the input file for a given day
 * @param day - The day number (e.g., 1 for day01)
 * @returns The contents of the input file as a string
 */
export function readInputTest(day: number): string {
  const dayStr = day.toString().padStart(2, '0');
  const inputPath = path.join(__dirname, '../../inputs', `day${dayStr}_test.txt`);
  return fs.readFileSync(inputPath, 'utf-8').trim();
}

/**
 * Reads the input file and splits it into lines
 * @param day - The day number
 * @returns Array of lines from the input file
 */
export function readInputLines(day: number): string[] {
  return readInput(day).split('\n');
}
