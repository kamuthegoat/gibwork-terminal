// language: JavaScript, file: src/commands/wallet.js, runtime: Node.js 22+, target: Cross-platform
const { Keypair, Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58');
const { getSignerKeypair } = require('../client');

const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

async function generateKeyCommand() {
  console.log(cyan(bold(`\n>>> GIBWORK TERMINAL — SOLANA KEYPAIR FACTORY`)));
  const kp = Keypair.generate();
  const secretKeyB58 = bs58.encode(kp.secretKey);
  const secretKeyJson = JSON.stringify(Array.from(kp.secretKey));

  console.log(dim('═'.repeat(70)));
  console.log(`${bold('PUBLIC KEY (Address):')}  ${green(kp.publicKey.toBase58())}`);
  console.log(`${bold('SECRET KEY (Base58):')}   ${yellow(secretKeyB58)}`);
  console.log(`${bold('SECRET KEY (JSON):')}     ${dim(secretKeyJson.substring(0, 30) + '... (64 bytes)')}`);
  console.log(dim('═'.repeat(70)));
  console.log(bold('\nUsage in .env:'));
  console.log(cyan(`SOLANA_PRIVATE_KEY=${secretKeyB58}\n`));
}

async function balanceCommand(addressOrTarget, cmdOptions) {
  let pubkeyStr = addressOrTarget;
  if (!pubkeyStr) {
    const kp = getSignerKeypair();
    pubkeyStr = kp.publicKey.toBase58();
  }

  console.log(cyan(bold(`\n>>> GIBWORK TERMINAL — WALLET AUDIT`)));
  console.log(dim(`Auditing Address: ${pubkeyStr}...\n`));

  try {
    const rpcEndpoint = cmdOptions.rpc || process.env.SOLANA_RPC_URL || clusterApiUrl('mainnet-beta');
    const connection = new Connection(rpcEndpoint, 'confirmed');
    const pubkey = new PublicKey(pubkeyStr);

    const lamports = await connection.getBalance(pubkey);
    const sol = lamports / LAMPORTS_PER_SOL;

    // Check USDC SPL Token Account
    const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    let usdcBalance = 0;
    try {
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, { mint: USDC_MINT });
      for (const ta of tokenAccounts.value) {
        usdcBalance += ta.account.data.parsed.info.tokenAmount.uiAmount || 0;
      }
    } catch {
      // Ignored if no token accounts found
    }

    console.log(dim('═'.repeat(60)));
    console.log(`${bold('WALLET ADDRESS:')}    ${green(pubkeyStr)}`);
    console.log(`${bold('SOL BALANCE:')}       ${cyan(sol.toFixed(6) + ' SOL')}`);
    console.log(`${bold('USDC BALANCE:')}      ${green('$' + usdcBalance.toFixed(2) + ' USDC')}`);
    console.log(`${bold('RPC ENDPOINT:')}      ${dim(rpcEndpoint)}`);
    console.log(dim('═'.repeat(60)) + '\n');
  } catch (err) {
    console.error(red(`\n[ERROR] Failed to query balance: ${err.message}\n`));
  }
}

module.exports = {
  generateKeyCommand,
  balanceCommand,
};
