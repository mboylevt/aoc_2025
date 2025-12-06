export function mathItUp(op: string, a: number, b: number): number {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        default: throw new Error(`Unknown operator: ${op}`);
    }
}


export function parseColumnMath(input: string[]): number {
    // Step 1: Find the maximum line length
    const maxLen = Math.max(...input.map(line => line.length));

    // Step 2: Pad all lines to same length and convert to 2D grid
    const grid = input.map(line => line.padEnd(maxLen, ' ').split(''));

    // Step 3: Transpose the grid (columns become rows)
    const cols: string[][] = [];
    for (let c = 0; c < maxLen; c++) {
        cols.push(grid.map(row => row[c]));
    }

    // Step 4: Find separator columns (all spaces)
    const separatorIndices: number[] = [];
    cols.forEach((col, idx) => {
        if (col.every(char => char === ' ')) {
            separatorIndices.push(idx);
        }
    });

    // Step 5: Split into problem sections
    const problems: string[][][] = [];
    let startIdx = 0;

    for (const sepIdx of separatorIndices) {
        if (sepIdx > startIdx) {
            problems.push(cols.slice(startIdx, sepIdx));
        }
        startIdx = sepIdx + 1;
    }
    // Don't forget the last section
    if (startIdx < cols.length) {
        problems.push(cols.slice(startIdx));
    }

    // Step 6: Process each problem (right-to-left)
    let grandTotal = 0;

    for (const problem of problems) {
        const numRows = problem[0].length - 1; // Last row is operator

        // Find the operator (check each column's last row)
        let operator = '';
        for (const col of problem) {
            const op = col[numRows].trim();
            if (op && (op === '+' || op === '*')) {
                operator = op;
                break;
            }
        }

        // Each column is a number (reading top-to-bottom)
        // Process columns right-to-left
        const numbers: number[] = [];

        for (let colIdx = problem.length - 1; colIdx >= 0; colIdx--) {
            const column = problem[colIdx];
            let numStr = '';

            // Read this column top-to-bottom (excluding operator row)
            for (let row = 0; row < numRows; row++) {
                const char = column[row];
                if (char !== ' ') {
                    numStr += char;
                }
            }

            if (numStr) {
                numbers.push(parseInt(numStr));
            }
        }

        // Calculate result based on operator
        if (numbers.length > 0) {
            let result = numbers[0];
            for (let i = 1; i < numbers.length; i++) {
                if (operator === '+') {
                    result += numbers[i];
                } else if (operator === '*') {
                    result *= numbers[i];
                }
            }
            grandTotal += result;
        }
    }

    return grandTotal;
}
