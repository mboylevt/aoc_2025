import { Solution } from '../utils/solution';
import { mathItUp, parseColumnMath } from '../utils/math';

class Day06 extends Solution<string[]> {


  part1(): number {
    // Starting Variables
    let equations: string[][] = []
    let grandTotal = 0;

    // Turn input into an array of strings
    this.input.forEach(rowString => {
      rowString = rowString.trimStart().trimEnd();
      let rowArray = rowString.split(/\s+/);
      equations.push(rowArray)
    });

    // transpose this matrix to make it each row a complete equation
    equations = equations[0].map((_, colIndex) =>
      equations.map(row => row[colIndex]))

    // solve each equation and add to the grand total
    equations.forEach(equation => {

      // initialize the total w/ the first argument, and grab the operation
      let operation = equation[equation.length - 1];
      let runningTotal = +equation[0]

      // trim off first argument and operand
      equation = equation.slice(1, equation.length - 1)

      // run the equation
      equation.forEach(arg => {
        switch (operation) {
          case '+': runningTotal += +arg; break;
          case '*': runningTotal *= +arg; break;
        }
      });
      grandTotal += runningTotal;
    });

    return grandTotal;
  }

  part2(): number {
    return parseColumnMath(this.input);
  }
}

// Run the solution
new Day06(6).run();
