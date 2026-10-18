#!/usr/bin/env node
// language: JavaScript, file: bin/gibwork-terminal.js, runtime: Node.js 22+, target: Cross-platform
const { Command } = require('commander');
const { listCommand } = require('../src/commands/list');
const { inspectCommand } = require('../src/commands/inspect');
const { watchCommand } = require('../src/commands/watch');
const { generateKeyCommand, balanceCommand } = require('../src/commands/wallet');
const { exportCommand } = require('../src/commands/export');

const program = new Command();

const banner = `
   ______   _   __                            __     ______                     _             __
  / ____/  (_) / /_   _      __  ____   _____/ /__  /_  __/___   _____ ____ ___  (_)____  ____ _/ /
 / / __   / / / __ \\ | | /| / / / __ \\ / ___/ //_/   / / / _ \\ / ___// __ \`__ \\/ // __ \\/ __ \`/ / 
/ /_/ /  / / / /_/ / | |/ |/ / / /_/ // /  / ,<     / / /  __// /   / / / / / / // / / / /_/ / /  
\\____/  /_/ /_.___/  |__/|__/  \\____//_/  /_/|_|   /_/  \\___//_/   /_/ /_/ /_/_//_/ /_/\\__,_/_/   
                                                                                                  
                  >> The Autonomous Gibwork CLI & Developer Sentinel <<
`;

program
  .name('gibwork-terminal')
  .description('Autonomous terminal utility and bounty sentinel built on @gibwork/sdk for Solana developers')
  .version('1.0.0')
  .hook('preAction', () => {
    // Optional banner display
  });

program
  .command('list')
  .description('Scan and list open Gibwork bounties with rewards and eligibility')
  .option('-p, --page <number>', 'Page number', '1')
  .option('-l, --limit <number>', 'Results per page (max 100)', '20')
  .option('-m, --min <amount>', 'Filter by minimum USD payout threshold')
  .option('--no-premium', 'Exclude bounties requiring premium/mobile status')
  .option('--stage', 'Target Gibwork stage API instead of mainnet production')
  .action((options) => listCommand(options));

program
  .command('inspect <taskId>')
  .description('Deep audit of a bounty: parsed specifications, deadline urgency, token mint, and payout rules')
  .option('--stage', 'Target Gibwork stage API instead of mainnet production')
  .action((taskId, options) => inspectCommand(taskId, options));

program
  .command('watch')
  .description('Autonomous background sentinel polling for newly dropped high-value bounties')
  .option('-m, --min <amount>', 'Minimum payout threshold in USD', '5.00')
  .option('-i, --interval <seconds>', 'Polling interval in seconds', '30')
  .option('-n, --iterations <number>', 'Max sentinel loops before exiting')
  .option('--stage', 'Target Gibwork stage API instead of mainnet production')
  .action((options) => watchCommand(options));

program
  .command('generate-key')
  .description('Generate a cryptographically secure Solana Keypair for automated bounty interactions')
  .action(() => generateKeyCommand());

program
  .command('balance [address]')
  .description('Audit SOL and USDC balances for an address or the configured private key')
  .option('--rpc <url>', 'Custom Solana RPC endpoint')
  .action((address, options) => balanceCommand(address, options));

program
  .command('export')
  .description('Export all active bounties to structured JSON or CSV for CI/CD pipelines')
  .option('-f, --format <format>', 'Export format: json or csv', 'json')
  .option('-o, --output <path>', 'Destination output file path')
  .option('--stage', 'Target Gibwork stage API instead of mainnet production')
  .action((options) => exportCommand(options));

if (!process.argv.slice(2).length) {
  console.log('\x1b[36m' + banner + '\x1b[0m');
  program.outputHelp();
} else {
  program.parse(process.argv);
}
