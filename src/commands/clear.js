/*
 * clear.js
 * Now with proper error handling using validator.js
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { readCommands } = require("../utils/storage");
const {
  isInitialized,
  showInitError,
  isValidCategory,
  showCategoryError
} = require("../utils/validator");
const colors = require("../utils/colors");

const COMMANDS_FILE = path.join(process.cwd(), ".tracker", "commands.json");

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function clearCommand(category) {

  /*
   * Check initialization first
   */
  if (!isInitialized()) {
    showInitError();
    return;
  }

  /*
   * Validate category if provided
   */
  if (category && !isValidCategory(category)) {
    showCategoryError(category);
    return;
  }

  try {
    const data = readCommands();

    if (category) {
      const cat = category.toLowerCase();

      if (data[cat].length === 0) {
        console.log(colors.warning(`\n📭 No commands saved in ${cat}\n`));
        return;
      }

      const answer = await ask(
        colors.warning(`\n⚠️  Clear all ${data[cat].length} ${cat} commands? `) + colors.dim("(yes/no): ")
      );

      if (answer.toLowerCase() !== "yes") {
        console.log(colors.error("❌ Cancelled\n"));
        return;
      }

      data[cat] = [];
      fs.writeFileSync(COMMANDS_FILE, JSON.stringify(data, null, 2));
      console.log(colors.success(`\n✅ Cleared all ${cat} commands\n`));
      return;
    }

    const total = Object.values(data).reduce(
      (sum, commands) => sum + commands.length, 0
    );

    if (total === 0) {
      console.log(colors.warning("\n📭 No commands saved yet\n"));
      return;
    }

    const answer = await ask(
      colors.warning(`\n⚠️  Clear ALL ${total} saved commands? This cannot be undone! `) + colors.dim("(yes/no): ")
    );
    if (answer.toLowerCase() !== "yes") {
      console.log(colors.error("❌ Cancelled\n"));
      return;
    }

    const emptyData = {
      git: [], npm: [], docker: [], linux: [],
      node: [], angular: [], python: [], others: []
    };

    fs.writeFileSync(COMMANDS_FILE, JSON.stringify(emptyData, null, 2));
    console.log(colors.success(`\n✅ Cleared all ${total} saved commands\n`));

  } catch (error) {
    console.log(colors.error("\n❌ Error clearing commands"));
    console.log(colors.info("💡 Try running tracker init again\n"));
  }
}

module.exports = { clearCommand };