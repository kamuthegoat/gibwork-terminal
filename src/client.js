// language: JavaScript, file: src/client.js, runtime: Node.js 22+, target: Cross-platform
const { Keypair } = require('@solana/web3.js');
const { createGibworkClient } = require('@gibwork/sdk/node');
const bs58 = require('bs58');
const dotenv = require('dotenv');

dotenv.config();

function getSignerKeypair() {
  const privateKeyRaw = process.env.SOLANA_PRIVATE_KEY;
  if (!privateKeyRaw) {
    // Generate an ephemeral keypair for read-only / discovery calls
    return Keypair.generate();
  }

  try {
    if (privateKeyRaw.startsWith('[') && privateKeyRaw.endsWith(']')) {
      const parsed = JSON.parse(privateKeyRaw);
      return Keypair.fromSecretKey(Uint8Array.from(parsed));
    }
    // Try base58 decode
    const decoded = bs58.decode(privateKeyRaw);
    if (decoded.length === 64) {
      return Keypair.fromSecretKey(decoded);
    }
    if (decoded.length === 32) {
      return Keypair.fromSeed(decoded);
    }
    throw new Error(`Invalid secret key length: ${decoded.length}`);
  } catch (err) {
    console.warn(`[WARN] Failed to parse SOLANA_PRIVATE_KEY (${err.message}). Using ephemeral key.`);
    return Keypair.generate();
  }
}

function initGibworkClient(options = {}) {
  const keypair = getSignerKeypair();
  const production = options.stage ? false : true;
  const client = createGibworkClient({
    privateKey: keypair.secretKey,
    production,
    timeoutMs: options.timeoutMs || 15000,
  });

  return { client, keypair, production };
}

module.exports = {
  getSignerKeypair,
  initGibworkClient,
};
