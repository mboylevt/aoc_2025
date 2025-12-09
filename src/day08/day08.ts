import { Solution } from '../utils/solution';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

class UnionFind {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = Array(size).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x: number, y: number): void {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
  }

  getCircuitSizes(): number[] {
    const componentMap = new Map<number, number>();

    for (let i = 0; i < this.parent.length; i++) {
      const root = this.find(i);
      componentMap.set(root, (componentMap.get(root) || 0) + 1);
    }

    return Array.from(componentMap.values());
  }

  getNumComponents(): number {
    const roots = new Set<number>();
    for (let i = 0; i < this.parent.length; i++) {
      roots.add(this.find(i));
    }
    return roots.size;
  }
}

class Day08 extends Solution<Point3D[]> {
  protected parseInput(input: string): Point3D[] {
    return input
      .trim()
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => {
        const [x, y, z] = line.split(',').map(Number);
        return { x, y, z };
      });
  }

  private calculateDistance(p1: Point3D, p2: Point3D): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  private solve(boxes: Point3D[], numConnections: number): number {
    const n = boxes.length;

    const pairs: { i: number; j: number; distance: number }[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const distance = this.calculateDistance(boxes[i], boxes[j]);
        pairs.push({ i, j, distance });
      }
    }

    pairs.sort((a, b) => a.distance - b.distance);

    const uf = new UnionFind(n);

    for (let k = 0; k < Math.min(numConnections, pairs.length); k++) {
      uf.union(pairs[k].i, pairs[k].j);
    }

    const sizes = uf.getCircuitSizes();
    sizes.sort((a, b) => b - a);

    if (sizes.length < 3) {
      return 0;
    }

    return sizes[0] * sizes[1] * sizes[2];
  }

  part1(): number {
    return this.solve(this.input, 1000);
  }

  part2(): number {
    const boxes = this.input;
    const n = boxes.length;

    if (n < 2) return 0;

    const pairs: { i: number; j: number; distance: number }[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const distance = this.calculateDistance(boxes[i], boxes[j]);
        pairs.push({ i, j, distance });
      }
    }

    pairs.sort((a, b) => a.distance - b.distance);

    const uf = new UnionFind(n);

    for (const pair of pairs) {
      uf.union(pair.i, pair.j);

      if (uf.getNumComponents() === 1) {
        return boxes[pair.i].x * boxes[pair.j].x;
      }
    }

    return 0;
  }

  test(): void {
    console.log('\n=== Test Part 1 (10 connections) ===');
    const testResult1 = this.solve(this.inputTest, 10);
    console.log(`Test result: ${testResult1} (expected: 40)`);

    console.log('\n=== Test Part 2 (connect all) ===');
    const boxes = this.inputTest;
    const n = boxes.length;
    const pairs: { i: number; j: number; distance: number }[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const distance = this.calculateDistance(boxes[i], boxes[j]);
        pairs.push({ i, j, distance });
      }
    }
    pairs.sort((a, b) => a.distance - b.distance);
    const uf = new UnionFind(n);
    for (const pair of pairs) {
      uf.union(pair.i, pair.j);
      if (uf.getNumComponents() === 1) {
        const testResult2 = boxes[pair.i].x * boxes[pair.j].x;
        console.log(`Test result: ${testResult2} (expected: 25272)`);
        console.log(`Connected boxes: (${boxes[pair.i].x},${boxes[pair.i].y},${boxes[pair.i].z}) and (${boxes[pair.j].x},${boxes[pair.j].y},${boxes[pair.j].z})`);
        break;
      }
    }
  }
}

// Run the solution
const solution = new Day08(8);
solution.test();
solution.run();
