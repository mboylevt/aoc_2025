/**
 * Runner script to execute solutions for specific days
 *
 * Usage:
 *   npm run solve src/run.ts 1      # Run day 1
 *   npm run solve src/run.ts 5      # Run day 5
 *   ts-node src/run.ts 1            # Alternative using ts-node directly
 */

const day = process.argv[2];

if (!day) {
  console.error('Usage: npm run solve src/run.ts <day>');
  console.error('Example: npm run solve src/run.ts 1');
  process.exit(1);
}

const dayNum = parseInt(day);
if (isNaN(dayNum) || dayNum < 1 || dayNum > 25) {
  console.error('Day must be a number between 1 and 25');
  process.exit(1);
}

const dayStr = dayNum.toString().padStart(2, '0');

// Dynamically import and run the solution
(async () => {
  try {
    await import(`./day${dayStr}/solution`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error running day ${dayNum}:`, error.message);
    }
    process.exit(1);
  }
})();
