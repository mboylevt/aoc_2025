# Project Structure Guide

## Overview

This project uses a class-based architecture for Advent of Code solutions. Each day extends an abstract `Solution` base class that handles common functionality like input reading and timing.

## Quick Start

### Running a Solution

```bash
# Run day 1
npm run solve src/day01/solution.ts

# Run using ts-node directly
ts-node src/day01/solution.ts

# Or using the runner
ts-node src/run.ts 1
```

### Creating a New Solution

1. Open `src/dayXX/solution.ts`
2. Import and extend the `Solution` class
3. Implement `part1()` and `part2()`
4. Optionally override `parseInput()` to customize input parsing

## Basic Template

```typescript
import { Solution } from '../utils/solution';

class Day01 extends Solution<string[]> {
  // Optional: customize input parsing
  protected parseInput(input: string): string[] {
    return input.split('\n');
  }

  part1(): number {
    // Your solution here
    // Access input via this.input
    return 0;
  }

  part2(): number {
    // Your solution here
    return 0;
  }
}

// Run the solution
new Day01(1).run();
```

## TypeScript Generic Types

The `Solution` class uses a generic type parameter to specify your input format:

- `Solution<string[]>` - Array of strings (default, one line per element)
- `Solution<number[]>` - Array of numbers
- `Solution<string[][]>` - 2D grid of strings
- `Solution<CustomType>` - Any custom type you define

## Common Parsing Patterns

See `src/utils/template.ts` for examples:

### Parse as Numbers
```typescript
class Day extends Solution<number[]> {
  protected parseInput(input: string): number[] {
    return input.split('\n').map(Number);
  }
}
```

### Parse as 2D Grid
```typescript
class Day extends Solution<string[][]> {
  protected parseInput(input: string): string[][] {
    return input.split('\n').map(line => line.split(''));
  }
}
```

### Parse into Custom Structure
```typescript
interface Instruction {
  command: string;
  value: number;
}

class Day extends Solution<Instruction[]> {
  protected parseInput(input: string): Instruction[] {
    return input.split('\n').map(line => {
      const [command, valueStr] = line.split(' ');
      return { command, value: parseInt(valueStr) };
    });
  }
}
```

### Parse Sections (separated by blank lines)
```typescript
class Day extends Solution<string[][]> {
  protected parseInput(input: string): string[][] {
    return input.split('\n\n').map(section => section.split('\n'));
  }
}
```

## File Structure

```
aoc_2025/
├── inputs/           # Input files (day01.txt, day02.txt, etc.)
├── src/
│   ├── day01/
│   │   └── solution.ts
│   ├── day02/
│   │   └── solution.ts
│   ├── utils/
│   │   ├── solution.ts    # Base class
│   │   ├── readInput.ts   # Input reading utilities
│   │   └── template.ts    # Example patterns
│   └── run.ts            # Runner script
└── package.json
```

## Benefits of This Structure

1. **Automatic Input Reading** - Input is read and parsed automatically
2. **Built-in Timing** - Both parts are timed automatically
3. **Type Safety** - TypeScript ensures type correctness
4. **Clean Separation** - Each day is isolated in its own file
5. **Reusable Patterns** - Common parsing patterns can be reused
6. **Easy Testing** - You can easily test parts independently

## Tips

- Start with the default `string[]` type and only customize if needed
- Use TypeScript interfaces for complex data structures
- The `parseInput()` method runs once during construction
- Both `part1()` and `part2()` can access `this.input`
- You can also access `this.rawInput` for the unparsed string
