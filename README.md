```markdown
# QuaiNetworkBot 🚀

This bot for automating transactions on the Quai Network Testnet using **QuaiSwap**. This tool helps users increase their on-chain activity, potentially earning rewards from the Quai Network. 

> **Disclaimer:** This project is for educational purposes only. Use it responsibly.

---

## Features 🌟

- Automates transactions of user-defined amounts on the **Quai Network Testnet**.
- Uses **QuaiSwap** to execute transactions.
- Fully customizable transaction parameters:
  - Amount to swap
  - Maximum transactions
  - Sleep interval between transactions
- Easy-to-use setup and configuration.
- Designed for increasing on-chain activity with potential benefits.

---

## Installation 🛠️

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HarbhagwanDhaliwal/QuaiNetworkBot.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd QuaiNetworkBot
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```

---

## Configuration ⚙️

1. **Update your credentials:**
   - Open the `credentials.json` file:
     ```bash
     nano credentials.json
     ```
   - Add your **Quai Network private key** and **wallet address**.

2. **Generate Hex Data:**
   - Visit [QuaiSwap](https://quaiswap.io/).
   - Try swapping a small amount (e.g., `0.012` Quai to Qswap). 
   - Copy the **Hex Data** from the wallet popup.
   - Reject the transaction in your wallet.
   - Save the copied Hex Data for use in the bot.

---

## Usage 🧑‍💻

1. **Start the bot:**
   ```bash
   node startAutoTranactions.js
   ```

2. **Input required parameters:**
   - **Swap Hex Data:** The Hex Data generated on QuaiSwap.
   - **Swap Amount:** The exact amount used to generate Hex Data.
   - **Max Transactions:** The maximum number of transactions to execute.
   - **Sleep Time:** The delay (in seconds) between each transaction.

3. **Example Input:**
   ```plaintext
   Enter the swap hex data: 0x123abc...
   Enter the swap amount: 0.012
   Enter the max transactions: 10
   Enter the sleep time in seconds: 5
   ```

4. **Note:** If you encounter a **"Transaction Expired"** error:
   - Regenerate Hex Data on QuaiSwap and update the bot inputs.
   - Rerun the bot.

---

## Support ❤️

If this bot helps you, don't forget to ⭐ **star the repository**. Your support is greatly appreciated!

---

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
```
