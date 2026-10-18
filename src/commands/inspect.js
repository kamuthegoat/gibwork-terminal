// language: JavaScript, file: src/commands/inspect.js, runtime: Node.js 22+, target: Cross-platform
const { initGibworkClient } = require('../client');

const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<h[1-6][^>]*>/gi, '\n=== ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '  • ')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<[^>]+>/gi, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

async function inspectCommand(taskId, cmdOptions) {
  if (!taskId) {
    console.error(red('[ERROR] Missing required argument: <taskId>'));
    return;
  }

  const { client, production } = initGibworkClient(cmdOptions);
  console.log(cyan(bold(`\n>>> GIBWORK TERMINAL — TASK DEEP-DIVE [${production ? 'MAINNET' : 'STAGE'}]`)));
  console.log(dim(`Auditing task ID: ${taskId}...\n`));

  try {
    const task = await client.tasks.get(taskId);

    const deadline = task.deadline ? new Date(task.deadline) : null;
    const now = new Date();
    const hoursLeft = deadline ? ((deadline - now) / (1000 * 60 * 60)).toFixed(1) : 'N/A';
    const urgency = hoursLeft !== 'N/A' && parseFloat(hoursLeft) <= 48 ? red(`URGENT (${hoursLeft}h remaining)`) : green(`${hoursLeft}h remaining`);

    console.log(dim('═'.repeat(80)));
    console.log(`${bold('TITLE:')}         ${cyan(task.title || 'Untitled')}`);
    console.log(`${bold('STATUS:')}        ${task.isOpen ? green('OPEN / ACTIVE') : red('CLOSED')}`);
    console.log(`${bold('PAYOUT:')}        ${green('$' + (task.minSubmissionAmount || '0.00'))} ${task.asset?.symbol || 'USDC'}`);
    console.log(`${bold('POOL:')}          ${task.asset?.amount ? (Number(task.asset.amount) / Math.pow(10, task.asset.decimals || 6)).toFixed(2) : 'N/A'} ${task.asset?.symbol || 'USDC'}`);
    console.log(`${bold('DEADLINE:')}      ${task.deadline || 'None'} | ${urgency}`);
    console.log(`${bold('PREMIUM ONLY:')}  ${task.requiresPremium ? red('YES (Mobile / VIP required)') : green('NO (Open to all)')}`);
    console.log(`${bold('SUBMISSIONS:')}   ${task.totalSubmissions || 0} submitted (Max: ${task.maxSubmissions || 'Unlimited'})`);
    console.log(`${bold('MINT ADDRESS:')}  ${dim(task.asset?.mintAddress || 'Native')}`);
    console.log(dim('═'.repeat(80)));

    console.log(bold('\n[ SPECIFICATION & SCOPE ]'));
    console.log(stripHtml(task.content) || dim('No description provided.'));

    if (task.requirements && task.requirements !== task.content) {
      console.log(bold('\n[ SUBMISSION REQUIREMENTS ]'));
      console.log(stripHtml(task.requirements));
    }

    console.log(dim('\n' + '═'.repeat(80)));
    console.log(dim(`Web Link: https://gib.work/bounty/${task.id}\n`));
  } catch (err) {
    console.error(red(`\n[ERROR] Failed to inspect task: ${err.message}`));
    if (err.body) {
      console.error(dim(`API Response: ${JSON.stringify(err.body)}`));
    }
  }
}

module.exports = { inspectCommand };
