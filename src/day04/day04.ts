import { Solution } from '../utils/solution';
import { Grid, Coord, Direction } from '../utils/grid';

function removeRolls(grid: Grid<string>): [number, Grid<string>] {
  let accessableRolls = 0;
  let newGrid = Grid.create(grid.rows, grid.cols, '.');
  for (let r = 0; r < grid.rows; r++) {
    // process.stdout.write('\n');
    for (let c = 0; c < grid.cols; c++) {
      if (grid.get(r, c) == '@') {
        let neighbors = grid.getNeighbors(r, c, true);
        let rollCount = 0
        neighbors.forEach(neighbor => {
          if (neighbor.value == '@') {
            rollCount += 1;
          }
        });
        if (rollCount < 4) {
          accessableRolls += 1
          // process.stdout.write('X');
        }
        else {
          // process.stdout.write('@');
          newGrid.set(r, c, '@');
        }
      }
      // else { process.stdout.write('.'); }
    }
  }
  // process.stdout.write('\n')
  return [accessableRolls, newGrid];
}

class Day04 extends Solution<string[]> {
  part1(): number {
    let [accessableRolls, newGrid] = removeRolls(Grid.fromLines(this.input));
    return accessableRolls;
  }

  part2(): number {
    // TODO: Implement part 2 solution
    let [removedRolls, newGrid] = removeRolls(Grid.fromLines(this.input));
    let totalRolls = removedRolls;
    while (removedRolls != 0) {
      [removedRolls, newGrid] = removeRolls(newGrid);
      totalRolls += removedRolls;
    }
    return totalRolls;
  }
}

// Run the solution
new Day04(4).run();
