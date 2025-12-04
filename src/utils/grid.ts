/**
 * Grid utility library for Advent of Code
 * Provides common grid operations with boundary checking
 */

export type Coord = { row: number; col: number };
export type Direction = 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';

/**
 * Direction vectors for grid movement
 */
export const DIRECTIONS = {
  N: { row: -1, col: 0 },
  S: { row: 1, col: 0 },
  E: { row: 0, col: 1 },
  W: { row: 0, col: -1 },
  NE: { row: -1, col: 1 },
  NW: { row: -1, col: -1 },
  SE: { row: 1, col: 1 },
  SW: { row: 1, col: -1 },
} as const;

/**
 * Cardinal directions only (N, S, E, W)
 */
export const CARDINAL_DIRECTIONS = [
  DIRECTIONS.N,
  DIRECTIONS.S,
  DIRECTIONS.E,
  DIRECTIONS.W,
] as const;

/**
 * All 8 directions including diagonals
 */
export const ALL_DIRECTIONS = [
  DIRECTIONS.N,
  DIRECTIONS.NE,
  DIRECTIONS.E,
  DIRECTIONS.SE,
  DIRECTIONS.S,
  DIRECTIONS.SW,
  DIRECTIONS.W,
  DIRECTIONS.NW,
] as const;

/**
 * Grid class with helper methods
 */
export class Grid<T = string> {
  constructor(
    public readonly data: T[][],
    public readonly rows: number,
    public readonly cols: number
  ) {}

  /**
   * Create a grid from an array of strings
   */
  static fromLines(lines: string[]): Grid<string> {
    const data = lines.map(line => line.split(''));
    return new Grid(data, data.length, data[0]?.length || 0);
  }

  /**
   * Create a grid with a default value
   */
  static create<T>(rows: number, cols: number, defaultValue: T): Grid<T> {
    const data = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => defaultValue)
    );
    return new Grid(data, rows, cols);
  }

  /**
   * Check if coordinates are within grid bounds
   */
  inBounds(row: number, col: number): boolean;
  inBounds(coord: Coord): boolean;
  inBounds(rowOrCoord: number | Coord, col?: number): boolean {
    const row = typeof rowOrCoord === 'number' ? rowOrCoord : rowOrCoord.row;
    const c = typeof rowOrCoord === 'number' ? col! : rowOrCoord.col;
    return row >= 0 && row < this.rows && c >= 0 && c < this.cols;
  }

  /**
   * Get value at coordinates (returns undefined if out of bounds)
   */
  get(row: number, col: number): T | undefined;
  get(coord: Coord): T | undefined;
  get(rowOrCoord: number | Coord, col?: number): T | undefined {
    const row = typeof rowOrCoord === 'number' ? rowOrCoord : rowOrCoord.row;
    const c = typeof rowOrCoord === 'number' ? col! : rowOrCoord.col;
    if (!this.inBounds(row, c)) return undefined;
    return this.data[row][c];
  }

  /**
   * Set value at coordinates (no-op if out of bounds)
   */
  set(row: number, col: number, value: T): void;
  set(coord: Coord, value: T): void;
  set(rowOrCoord: number | Coord, colOrValue: number | T, value?: T): void {
    const row = typeof rowOrCoord === 'number' ? rowOrCoord : rowOrCoord.row;
    const c = typeof rowOrCoord === 'number' ? (colOrValue as number) : rowOrCoord.col;
    const val = typeof rowOrCoord === 'number' ? value! : (colOrValue as T);
    if (!this.inBounds(row, c)) return;
    this.data[row][c] = val;
  }

  /**
   * Get all valid neighbors (4-directional by default)
   */
  getNeighbors(
    row: number,
    col: number,
    includeDiagonals?: boolean
  ): Array<{ coord: Coord; value: T }>;
  getNeighbors(
    coord: Coord,
    includeDiagonals?: boolean
  ): Array<{ coord: Coord; value: T }>;
  getNeighbors(
    rowOrCoord: number | Coord,
    colOrIncludeDiagonals?: number | boolean,
    includeDiagonals = false
  ): Array<{ coord: Coord; value: T }> {
    const row = typeof rowOrCoord === 'number' ? rowOrCoord : rowOrCoord.row;
    const col =
      typeof rowOrCoord === 'number'
        ? (colOrIncludeDiagonals as number)
        : rowOrCoord.col;
    const diagonals =
      typeof rowOrCoord === 'number'
        ? includeDiagonals
        : (colOrIncludeDiagonals as boolean) || false;

    const directions = diagonals ? ALL_DIRECTIONS : CARDINAL_DIRECTIONS;
    const neighbors: Array<{ coord: Coord; value: T }> = [];

    for (const dir of directions) {
      const newRow = row + dir.row;
      const newCol = col + dir.col;
      if (this.inBounds(newRow, newCol)) {
        neighbors.push({
          coord: { row: newRow, col: newCol },
          value: this.data[newRow][newCol],
        });
      }
    }

    return neighbors;
  }

  /**
   * Get neighbor coordinates only (without values)
   */
  getNeighborCoords(
    row: number,
    col: number,
    includeDiagonals?: boolean
  ): Coord[];
  getNeighborCoords(coord: Coord, includeDiagonals?: boolean): Coord[];
  getNeighborCoords(
    rowOrCoord: number | Coord,
    colOrIncludeDiagonals?: number | boolean,
    includeDiagonals = false
  ): Coord[] {
    return this.getNeighbors(
      rowOrCoord as any,
      colOrIncludeDiagonals as any,
      includeDiagonals
    ).map(n => n.coord);
  }

  /**
   * Move in a direction from a position
   */
  move(coord: Coord, direction: Direction): Coord | undefined {
    const dir = DIRECTIONS[direction];
    const newCoord = { row: coord.row + dir.row, col: coord.col + dir.col };
    return this.inBounds(newCoord) ? newCoord : undefined;
  }

  /**
   * Find all positions where predicate is true
   */
  findAll(predicate: (value: T, coord: Coord) => boolean): Coord[] {
    const results: Coord[] = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (predicate(this.data[row][col], { row, col })) {
          results.push({ row, col });
        }
      }
    }
    return results;
  }

  /**
   * Find first position where predicate is true
   */
  find(predicate: (value: T, coord: Coord) => boolean): Coord | undefined {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (predicate(this.data[row][col], { row, col })) {
          return { row, col };
        }
      }
    }
    return undefined;
  }

  /**
   * Iterate over all cells
   */
  forEach(callback: (value: T, coord: Coord) => void): void {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        callback(this.data[row][col], { row, col });
      }
    }
  }

  /**
   * Map grid to new grid
   */
  map<U>(callback: (value: T, coord: Coord) => U): Grid<U> {
    const newData = this.data.map((row, r) =>
      row.map((value, c) => callback(value, { row: r, col: c }))
    );
    return new Grid(newData, this.rows, this.cols);
  }

  /**
   * Clone the grid
   */
  clone(): Grid<T> {
    const newData = this.data.map(row => [...row]);
    return new Grid(newData, this.rows, this.cols);
  }

  /**
   * Print grid to console (useful for debugging)
   */
  print(transform?: (value: T) => string): void {
    for (const row of this.data) {
      console.log(row.map(v => (transform ? transform(v) : String(v))).join(''));
    }
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return this.data.map(row => row.join('')).join('\n');
  }
}

/**
 * Standalone helper functions
 */

/**
 * Check if coordinates are within bounds
 */
export function inBounds(
  row: number,
  col: number,
  rows: number,
  cols: number
): boolean {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

/**
 * Get valid neighbors for a position
 */
export function getNeighbors(
  row: number,
  col: number,
  rows: number,
  cols: number,
  includeDiagonals = false
): Coord[] {
  const directions = includeDiagonals ? ALL_DIRECTIONS : CARDINAL_DIRECTIONS;
  const neighbors: Coord[] = [];

  for (const dir of directions) {
    const newRow = row + dir.row;
    const newCol = col + dir.col;
    if (inBounds(newRow, newCol, rows, cols)) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }

  return neighbors;
}

/**
 * Manhattan distance between two coordinates
 */
export function manhattanDistance(a: Coord, b: Coord): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/**
 * Chebyshev distance (max of row and col differences)
 */
export function chebyshevDistance(a: Coord, b: Coord): number {
  return Math.max(Math.abs(a.row - b.row), Math.abs(a.col - b.col));
}

/**
 * Create a coordinate key for use in Sets/Maps
 */
export function coordKey(row: number, col: number): string;
export function coordKey(coord: Coord): string;
export function coordKey(rowOrCoord: number | Coord, col?: number): string {
  const row = typeof rowOrCoord === 'number' ? rowOrCoord : rowOrCoord.row;
  const c = typeof rowOrCoord === 'number' ? col! : rowOrCoord.col;
  return `${row},${c}`;
}

/**
 * Parse a coordinate key back to a Coord
 */
export function parseCoordKey(key: string): Coord {
  const [row, col] = key.split(',').map(Number);
  return { row, col };
}
