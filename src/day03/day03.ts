import { Solution } from '../utils/solution';

class Day3 extends Solution<string[]> {
  part1(): number {
    let joltsTotal = 0;
    this.input.forEach(bankString => {
      let big = -1
      let big2 = -2
      for (let i = 0; i < bankString.length; i++) {
        let battery = bankString[i];
        if (+battery > big && i != bankString.length - 1) {
          big = +battery;
          big2 = -1;
        }
        else if (+battery > big2) {
          big2 = +battery;
        }
      }
      let bankValue = +(big.toString() + big2.toString());
      joltsTotal += bankValue;
    });

    return joltsTotal;
  }

  part2(): number {
    const findLargestKDigits = (s: string, k: number): number => {
      const toRemove = s.length - k;
      const stack: string[] = [];
      let removed = 0;

      // Use decreasing stack to keep largest digits
      for (let i = 0; i < s.length; i++) {
        // Remove smaller digits before current digit
        while (stack.length > 0 &&
          stack[stack.length - 1] < s[i] &&
          removed < toRemove) {
          stack.pop();
          removed++;
        }
        stack.push(s[i]);
      }

      // Remove remaining digits from the end if needed
      while (removed < toRemove) {
        stack.pop();
        removed++;
      }

      return parseInt(stack.join(''));
    };

    let joltsTotal = 0;
    this.input.forEach(bankString => {
      joltsTotal += findLargestKDigits(bankString, 12);
    });

    return joltsTotal;
  }
}

// Run the solution
new Day3(3).run();