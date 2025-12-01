# Advent of Code 2025 - TypeScript Solutions

This project contains solutions for Advent of Code 2025 written in TypeScript.

## Setup

Install dependencies:
```bash
npm install
```

## Project Structure

- `src/` - Source code directory
  - `day01/`, `day02/`, etc. - Solutions for each day
  - `utils/` - Shared utility functions
- `inputs/` - Input files for each day (day01.txt, day02.txt, etc.)
- `dist/` - Compiled JavaScript output (created after build)

## Usage

### Running a solution

To run a specific day's solution:
```bash
npm run solve src/day01/solution.ts
```

### Building the project

To compile TypeScript to JavaScript:
```bash
npm run build
```

To watch for changes and recompile automatically:
```bash
npm run watch
```

## Creating a new day

1. Create a new directory in `src/` (e.g., `src/day03/`)
2. Create `solution.ts` in that directory (you can copy from day01)
3. Create the corresponding input file in `inputs/` (e.g., `inputs/day03.txt`)
4. Run with `npm run solve src/day03/solution.ts`

## Tips for TypeScript beginners

- TypeScript adds static typing to JavaScript
- Use `: type` to annotate variable and function types
- The `tsconfig.json` file configures TypeScript behavior
- VSCode will provide excellent autocomplete and error checking
- You can hover over variables in VSCode to see their types
# aoc_2025
