// Import the Quai SDK
import { quais, parseQuai, isAddress } from 'quais';
import readline from 'readline';
import fs from 'fs';

// Set up the provider (connecting to a remote node)
const provider = new quais.JsonRpcProvider('https://rpc.quai.network', undefined, { usePathing: true });

// Function to get user input at runtime
const getUserInput = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => rl.question(query, (answer) => {
    rl.close();
    resolve(answer);
  }));
};

// Function to execute a transaction with retry logic
const executeTransaction = async (transactionData, wallet, transactionNumber) => {
  try {
    console.log(`Attempting transaction ${transactionNumber}...`);

    // Send transaction
    const tx = await wallet.sendTransaction(transactionData);
    console.log("Transaction sent! Waiting for confirmation...");

    // Wait for confirmation
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      console.log("Transaction successful:", receipt.transactionHash);
      return receipt;
    } else {
      throw new Error("Transaction execution reverted");
    }
  } catch (error) {
    if (error.reason === "UniswapV2Router: EXPIRED") {
      console.error("Transaction expired. Stopping further attempts.");
      throw error; // Stop the loop if the transaction expired
    } else {
      console.error("Unexpected error:", error.message);
      return null; // Continue for all other errors
    }
  }
};

// Main function
(async () => {
  try {
    // Load credentials from the JSON file
    const credentialsPath = './credentials.json';
    if (!fs.existsSync(credentialsPath)) {
      throw new Error(`Missing credentials file at ${credentialsPath}`);
    }

    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
    const { privateKey, fromAddress } = credentials;

    // Validate credentials
    if (!privateKey || privateKey.length !== 66 || !privateKey.startsWith('0x')) {
      throw new Error('Invalid private key in credentials file');
    }
    if (!isAddress(fromAddress)) {
      throw new Error('Invalid from address in credentials file');
    }

    // Get other user inputs
    const firstSwapHexData = await getUserInput('Enter the swap hex data: ');
    const firstSwapAmount = await getUserInput('Enter the swap amount: ');
    const maxTransactionSwap = parseInt(await getUserInput('Enter the max transactions: '), 10);
    const sleepTime = parseInt(await getUserInput('Enter the sleep time in seconds: '), 10);

    // Validate inputs
    if (isNaN(maxTransactionSwap) || maxTransactionSwap <= 0) {
      throw new Error('Invalid max transactions count');
    }
    if (isNaN(sleepTime) || sleepTime <= 0) {
      throw new Error('Invalid sleep time');
    }
    if (isNaN(parseFloat(firstSwapAmount)) || parseFloat(firstSwapAmount) <= 0) {
      throw new Error('Invalid first swap amount');
    }

    // Initialize the wallet
    const wallet = new quais.Wallet(privateKey, provider);

    for (let i = 0; i < maxTransactionSwap; i++) {
      try {
        const txData = {
          from: fromAddress,
          to: '0x000958059C42b65931734D0c54E5D11D9ae4ED1d',
          value: parseQuai(firstSwapAmount),
          gasPrice: parseQuai('0.00000044'),
          data: firstSwapHexData
        };

        // Validate the recipient address
        if (!isAddress(txData.to)) {
          throw new Error('Invalid recipient address');
        }

        // Execute the transaction
        const receipt = await executeTransaction(txData, wallet, i + 1);
        if (!receipt) {
          console.error(`Transaction ${i + 1} failed but will proceed with the next.`);
        }

        // Sleep before the next transaction if it's not the last one
        if (i < maxTransactionSwap - 1) {
          console.log(`Waiting for ${sleepTime} seconds before the next transaction...`);
          await new Promise((resolve) => setTimeout(resolve, sleepTime * 1000));
        }
      } catch (error) {
        if (error.reason === "UniswapV2Router: EXPIRED") {
          console.error("Expired transaction encountered. Stopping all further attempts.");
          break; // Stop the loop for expired transactions
        }
        console.error('Error during transaction loop:', error.message);
        // Continue to the next iteration for all other errors
      }
    }

    console.log('Transaction processing completed.');
  } catch (error) {
    console.error('Error:', error);
  }
})();
