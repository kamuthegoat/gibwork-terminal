// language: JavaScript, file: src/commands/export.js, runtime: Node.js 22+, target: Cross-platform
const fs = require('fs');
const path = require('path');
const { initGibworkClient } = require('../client');

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

async function exportCommand(cmdOptions) {
  const { client } = initGibworkClient(cmdOptions);
  console.log(dim('Fetching all active bounties for export...'));

  try {
    const response = await client.tasks.listAvailable({ page: 1, limit: 100 });
    const tasks = response.results || [];

    const format = (cmdOptions.format || 'json').toLowerCase();
    const outputFile = cmdOptions.output || path.join(process.cwd(), `gibwork-export-${Date.now()}.${format}`);

    if (format === 'json') {
      fs.writeFileSync(outputFile, JSON.stringify(tasks, null, 2), 'utf8');
    } else if (format === 'csv') {
      const headers = ['id', 'title', 'minSubmissionAmount', 'assetSymbol', 'requiresPremium', 'deadline', 'totalSubmissions'];
      const rows = tasks.map((t) => [
        t.id,
        `"${(t.title || '').replace(/"/g, '""')}"`,
        t.minSubmissionAmount || '0',
        t.asset?.symbol || 'USDC',
        t.requiresPremium ? 'true' : 'false',
        t.deadline || '',
        t.totalSubmissions || '0',
      ]);
      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      fs.writeFileSync(outputFile, csv, 'utf8');
    } else {
      throw new Error(`Unsupported export format: ${format}. Use 'json' or 'csv'.`);
    }

    console.log(green(`\n[SUCCESS] Exported ${tasks.length} bounties to ${outputFile}\n`));
  } catch (err) {
    console.error(red(`\n[ERROR] Export failed: ${err.message}\n`));
  }
}

module.exports = { exportCommand };
