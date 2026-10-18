// language: JavaScript, file: src/commands/list.js, runtime: Node.js 22+, target: Cross-platform
const { initGibworkClient } = require('../client');

// ANSI Color Helpers
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

async function listCommand(cmdOptions) {
  const { client, production } = initGibworkClient(cmdOptions);
  console.log(cyan(bold(`\n>>> GIBWORK TERMINAL — LIVE TASK RADAR [${production ? 'MAINNET' : 'STAGE'}]`)));
  console.log(dim('Fetching open bounties via @gibwork/sdk...\n'));

  try {
    const page = parseInt(cmdOptions.page || '1', 10);
    const limit = parseInt(cmdOptions.limit || '20', 10);

    const response = await client.tasks.listAvailable({ page, limit });
    const tasks = response.results || [];

    if (tasks.length === 0) {
      console.log(yellow('No active tasks found matching criteria.'));
      return;
    }

    console.log(dim('─'.repeat(100)));
    console.log(
      `${bold('ID'.padEnd(38))} | ${bold('MIN PAYOUT'.padEnd(12))} | ${bold('ASSET'.padEnd(10))} | ${bold('PREMIUM'.padEnd(8))} | ${bold('TITLE')}`
    );
    console.log(dim('─'.repeat(100)));

    let filteredCount = 0;
    for (const t of tasks) {
      const minAmount = parseFloat(t.minSubmissionAmount || '0');
      if (cmdOptions.min && minAmount < parseFloat(cmdOptions.min)) {
        continue;
      }
      if (cmdOptions.noPremium && t.requiresPremium) {
        continue;
      }

      const id = dim(t.id);
      const symbol = t.asset?.symbol || 'USDC';
      const payoutStr = green(`$${minAmount.toFixed(2).padStart(8)}`);
      const assetStr = cyan(symbol.padEnd(10));
      const premStr = t.requiresPremium ? red('YES     ') : green('NO      ');
      const titleStr = t.title.length > 40 ? t.title.substring(0, 37) + '...' : t.title;

      console.log(`${id} | ${payoutStr} | ${assetStr} | ${premStr} | ${bold(titleStr)}`);
      filteredCount++;
    }

    console.log(dim('─'.repeat(100)));
    console.log(
      `Displaying ${green(filteredCount)} of ${tasks.length} tasks (Page ${page}/${response.lastPage || 1}, Total: ${response.total || tasks.length})\n`
    );
  } catch (err) {
    console.error(red(`\n[ERROR] Failed to list tasks: ${err.message}`));
    if (err.body) {
      console.error(dim(`API Response: ${JSON.stringify(err.body)}`));
    }
  }
}

module.exports = { listCommand };
