// language: JavaScript, file: src/commands/watch.js, runtime: Node.js 22+, target: Cross-platform
const { initGibworkClient } = require('../client');

const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function watchCommand(cmdOptions) {
  const { client, production } = initGibworkClient(cmdOptions);
  const minPayout = parseFloat(cmdOptions.min || '5.00');
  const intervalSec = parseInt(cmdOptions.interval || '30', 10);
  const seenTaskIds = new Set();

  console.log(cyan(bold(`\n>>> GIBWORK TERMINAL — AUTONOMOUS BOUNTY SENTINEL`)));
  console.log(dim(`Environment: ${production ? 'Production (Mainnet)' : 'Stage'}`));
  console.log(dim(`Target Threshold: >= $${minPayout.toFixed(2)} USD`));
  console.log(dim(`Poll Interval: ${intervalSec} seconds. Press Ctrl+C to stop.\n`));

  let pollCount = 0;
  while (true) {
    pollCount++;
    const now = new Date().toLocaleTimeString();

    try {
      const response = await client.tasks.listAvailable({ page: 1, limit: 30 });
      const tasks = response.results || [];

      let matchingCount = 0;
      for (const t of tasks) {
        const amount = parseFloat(t.minSubmissionAmount || '0');
        if (amount >= minPayout) {
          matchingCount++;
          if (!seenTaskIds.has(t.id)) {
            seenTaskIds.add(t.id);
            console.log(
              `\n${green('⚡ [NEW BOUNTY DETECTED!]')} ${bold(t.title)}\n` +
              `   ${cyan('Reward:')}   $${amount.toFixed(2)} ${t.asset?.symbol || 'USDC'}\n` +
              `   ${cyan('Task ID:')}  ${t.id}\n` +
              `   ${cyan('Urgency:')}  Deadline: ${t.deadline || 'None'}\n` +
              `   ${cyan('Action:')}   gibwork-terminal inspect ${t.id}\n`
            );
          }
        }
      }

      process.stdout.write(`\r${dim(`[${now}] Sentinel ping #${pollCount}: Scanned ${tasks.length} tasks. ${matchingCount} match >= $${minPayout.toFixed(2)}.`)} `);
    } catch (err) {
      console.error(`\n${red(`[WARN] Poller encounter: ${err.message}`)}`);
    }

    if (cmdOptions.iterations && pollCount >= parseInt(cmdOptions.iterations, 10)) {
      console.log(`\n${green('Sentinel completed specified iterations.')}\n`);
      break;
    }

    await sleep(intervalSec * 1000);
  }
}

module.exports = { watchCommand };
