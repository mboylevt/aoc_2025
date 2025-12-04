import {
  Grid,
  Coord,
  DIRECTIONS,
  CARDINAL_DIRECTIONS,
  ALL_DIRECTIONS,
  inBounds,
  getNeighbors,
  manhattanDistance,
  chebyshevDistance,
  coordKey,
  parseCoordKey,
} from './grid';

describe('Grid', () => {
  describe('Grid.fromLines', () => {
    it('should create a grid from string array', () => {
      const lines = ['abc', 'def', 'ghi'];
      const grid = Grid.fromLines(lines);

      expect(grid.rows).toBe(3);
      expect(grid.cols).toBe(3);
      expect(grid.get(0, 0)).toBe('a');
      expect(grid.get(1, 1)).toBe('e');
      expect(grid.get(2, 2)).toBe('i');
    });

    it('should handle empty array', () => {
      const grid = Grid.fromLines([]);
      expect(grid.rows).toBe(0);
      expect(grid.cols).toBe(0);
    });
  });

  describe('Grid.create', () => {
    it('should create a grid with default values', () => {
      const grid = Grid.create(3, 4, 0);

      expect(grid.rows).toBe(3);
      expect(grid.cols).toBe(4);
      expect(grid.get(0, 0)).toBe(0);
      expect(grid.get(2, 3)).toBe(0);
    });
  });

  describe('inBounds', () => {
    const grid = Grid.fromLines(['abc', 'def']);

    it('should return true for valid coordinates', () => {
      expect(grid.inBounds(0, 0)).toBe(true);
      expect(grid.inBounds(1, 2)).toBe(true);
      expect(grid.inBounds({ row: 0, col: 1 })).toBe(true);
    });

    it('should return false for out of bounds coordinates', () => {
      expect(grid.inBounds(-1, 0)).toBe(false);
      expect(grid.inBounds(0, -1)).toBe(false);
      expect(grid.inBounds(2, 0)).toBe(false);
      expect(grid.inBounds(0, 3)).toBe(false);
      expect(grid.inBounds({ row: -1, col: 0 })).toBe(false);
    });
  });

  describe('get', () => {
    const grid = Grid.fromLines(['abc', 'def', 'ghi']);

    it('should get values at valid coordinates', () => {
      expect(grid.get(0, 0)).toBe('a');
      expect(grid.get(1, 1)).toBe('e');
      expect(grid.get(2, 2)).toBe('i');
      expect(grid.get({ row: 1, col: 0 })).toBe('d');
    });

    it('should return undefined for out of bounds', () => {
      expect(grid.get(-1, 0)).toBeUndefined();
      expect(grid.get(0, 3)).toBeUndefined();
      expect(grid.get(3, 0)).toBeUndefined();
      expect(grid.get({ row: -1, col: 0 })).toBeUndefined();
    });
  });

  describe('set', () => {
    it('should set values at valid coordinates', () => {
      const grid = Grid.fromLines(['abc', 'def']);
      grid.set(0, 0, 'x');
      grid.set({ row: 1, col: 1 }, 'y');

      expect(grid.get(0, 0)).toBe('x');
      expect(grid.get(1, 1)).toBe('y');
    });

    it('should do nothing for out of bounds', () => {
      const grid = Grid.fromLines(['abc', 'def']);
      grid.set(-1, 0, 'x');
      grid.set(2, 0, 'x');

      // Should not crash, just ignore
      expect(grid.rows).toBe(2);
    });
  });

  describe('getNeighbors', () => {
    const grid = Grid.fromLines(['abc', 'def', 'ghi']);

    it('should get 4-directional neighbors for center cell', () => {
      const neighbors = grid.getNeighbors(1, 1);

      expect(neighbors).toHaveLength(4);
      expect(neighbors.map(n => n.value).sort()).toEqual(['b', 'd', 'f', 'h']);
    });

    it('should get 8-directional neighbors for center cell', () => {
      const neighbors = grid.getNeighbors(1, 1, true);

      expect(neighbors).toHaveLength(8);
      expect(neighbors.map(n => n.value).sort()).toEqual([
        'a',
        'b',
        'c',
        'd',
        'f',
        'g',
        'h',
        'i',
      ]);
    });

    it('should handle corner cells (no out-of-bounds)', () => {
      const neighbors = grid.getNeighbors(0, 0);

      expect(neighbors).toHaveLength(2);
      expect(neighbors.map(n => n.value).sort()).toEqual(['b', 'd']);
    });

    it('should handle edge cells', () => {
      const neighbors = grid.getNeighbors(0, 1);

      expect(neighbors).toHaveLength(3);
      expect(neighbors.map(n => n.value).sort()).toEqual(['a', 'c', 'e']);
    });

    it('should work with Coord parameter', () => {
      const neighbors = grid.getNeighbors({ row: 1, col: 1 });

      expect(neighbors).toHaveLength(4);
    });
  });

  describe('getNeighborCoords', () => {
    const grid = Grid.fromLines(['abc', 'def', 'ghi']);

    it('should return only coordinates', () => {
      const coords = grid.getNeighborCoords(1, 1);

      expect(coords).toHaveLength(4);
      expect(coords).toContainEqual({ row: 0, col: 1 });
      expect(coords).toContainEqual({ row: 2, col: 1 });
      expect(coords).toContainEqual({ row: 1, col: 0 });
      expect(coords).toContainEqual({ row: 1, col: 2 });
    });
  });

  describe('move', () => {
    const grid = Grid.fromLines(['abc', 'def', 'ghi']);

    it('should move in valid directions', () => {
      const start = { row: 1, col: 1 };

      expect(grid.move(start, 'N')).toEqual({ row: 0, col: 1 });
      expect(grid.move(start, 'S')).toEqual({ row: 2, col: 1 });
      expect(grid.move(start, 'E')).toEqual({ row: 1, col: 2 });
      expect(grid.move(start, 'W')).toEqual({ row: 1, col: 0 });
      expect(grid.move(start, 'NE')).toEqual({ row: 0, col: 2 });
    });

    it('should return undefined for out of bounds moves', () => {
      const corner = { row: 0, col: 0 };

      expect(grid.move(corner, 'N')).toBeUndefined();
      expect(grid.move(corner, 'W')).toBeUndefined();
      expect(grid.move(corner, 'NW')).toBeUndefined();
    });
  });

  describe('findAll', () => {
    const grid = Grid.fromLines(['aba', 'cac', 'aba']);

    it('should find all matching positions', () => {
      const positions = grid.findAll(val => val === 'a');

      expect(positions).toHaveLength(5);
      expect(positions).toContainEqual({ row: 0, col: 0 });
      expect(positions).toContainEqual({ row: 0, col: 2 });
      expect(positions).toContainEqual({ row: 1, col: 1 });
    });

    it('should return empty array if no matches', () => {
      const positions = grid.findAll(val => val === 'z');

      expect(positions).toHaveLength(0);
    });
  });

  describe('find', () => {
    const grid = Grid.fromLines(['abc', 'def', 'ghi']);

    it('should find first matching position', () => {
      const pos = grid.find(val => val === 'e');

      expect(pos).toEqual({ row: 1, col: 1 });
    });

    it('should return undefined if no match', () => {
      const pos = grid.find(val => val === 'z');

      expect(pos).toBeUndefined();
    });
  });

  describe('forEach', () => {
    it('should iterate over all cells', () => {
      const grid = Grid.fromLines(['ab', 'cd']);
      const visited: string[] = [];

      grid.forEach((val, coord) => {
        visited.push(`${val}:${coord.row},${coord.col}`);
      });

      expect(visited).toEqual(['a:0,0', 'b:0,1', 'c:1,0', 'd:1,1']);
    });
  });

  describe('map', () => {
    it('should transform grid values', () => {
      const grid = Grid.fromLines(['12', '34']);
      const numGrid = grid.map(val => parseInt(val));

      expect(numGrid.get(0, 0)).toBe(1);
      expect(numGrid.get(1, 1)).toBe(4);
    });
  });

  describe('clone', () => {
    it('should create independent copy', () => {
      const grid1 = Grid.fromLines(['abc', 'def']);
      const grid2 = grid1.clone();

      grid2.set(0, 0, 'x');

      expect(grid1.get(0, 0)).toBe('a');
      expect(grid2.get(0, 0)).toBe('x');
    });
  });

  describe('toString', () => {
    it('should convert grid to string', () => {
      const grid = Grid.fromLines(['abc', 'def']);

      expect(grid.toString()).toBe('abc\ndef');
    });
  });
});

describe('Standalone functions', () => {
  describe('inBounds', () => {
    it('should check bounds correctly', () => {
      expect(inBounds(0, 0, 3, 3)).toBe(true);
      expect(inBounds(2, 2, 3, 3)).toBe(true);
      expect(inBounds(-1, 0, 3, 3)).toBe(false);
      expect(inBounds(3, 0, 3, 3)).toBe(false);
      expect(inBounds(0, 3, 3, 3)).toBe(false);
    });
  });

  describe('getNeighbors', () => {
    it('should get 4-directional neighbors', () => {
      const neighbors = getNeighbors(1, 1, 3, 3);

      expect(neighbors).toHaveLength(4);
      expect(neighbors).toContainEqual({ row: 0, col: 1 });
      expect(neighbors).toContainEqual({ row: 2, col: 1 });
      expect(neighbors).toContainEqual({ row: 1, col: 0 });
      expect(neighbors).toContainEqual({ row: 1, col: 2 });
    });

    it('should get 8-directional neighbors', () => {
      const neighbors = getNeighbors(1, 1, 3, 3, true);

      expect(neighbors).toHaveLength(8);
    });

    it('should handle edges', () => {
      const neighbors = getNeighbors(0, 0, 3, 3);

      expect(neighbors).toHaveLength(2);
    });
  });

  describe('manhattanDistance', () => {
    it('should calculate Manhattan distance', () => {
      expect(manhattanDistance({ row: 0, col: 0 }, { row: 0, col: 0 })).toBe(0);
      expect(manhattanDistance({ row: 0, col: 0 }, { row: 3, col: 4 })).toBe(7);
      expect(manhattanDistance({ row: 1, col: 1 }, { row: 4, col: 5 })).toBe(7);
    });
  });

  describe('chebyshevDistance', () => {
    it('should calculate Chebyshev distance', () => {
      expect(chebyshevDistance({ row: 0, col: 0 }, { row: 0, col: 0 })).toBe(0);
      expect(chebyshevDistance({ row: 0, col: 0 }, { row: 3, col: 4 })).toBe(4);
      expect(chebyshevDistance({ row: 1, col: 1 }, { row: 4, col: 3 })).toBe(3);
    });
  });

  describe('coordKey', () => {
    it('should create coordinate keys', () => {
      expect(coordKey(1, 2)).toBe('1,2');
      expect(coordKey({ row: 3, col: 4 })).toBe('3,4');
      expect(coordKey(0, 0)).toBe('0,0');
    });
  });

  describe('parseCoordKey', () => {
    it('should parse coordinate keys', () => {
      expect(parseCoordKey('1,2')).toEqual({ row: 1, col: 2 });
      expect(parseCoordKey('0,0')).toEqual({ row: 0, col: 0 });
      expect(parseCoordKey('10,20')).toEqual({ row: 10, col: 20 });
    });
  });
});

describe('Constants', () => {
  it('should have correct direction vectors', () => {
    expect(DIRECTIONS.N).toEqual({ row: -1, col: 0 });
    expect(DIRECTIONS.S).toEqual({ row: 1, col: 0 });
    expect(DIRECTIONS.E).toEqual({ row: 0, col: 1 });
    expect(DIRECTIONS.W).toEqual({ row: 0, col: -1 });
    expect(DIRECTIONS.NE).toEqual({ row: -1, col: 1 });
  });

  it('should have 4 cardinal directions', () => {
    expect(CARDINAL_DIRECTIONS).toHaveLength(4);
  });

  it('should have 8 total directions', () => {
    expect(ALL_DIRECTIONS).toHaveLength(8);
  });
});
