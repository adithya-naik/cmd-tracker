/*
 * clear.js
 * Now with proper error handling using validator.js
 */

import fs from "fs";
import path from "path";
import readline from "readline";

import { readCommands } from "../utils/storage.js";
import {
  isInitialized,
  showInitError,
  isValidCategory,
  showCategoryError
} from "../utils/validator.js";

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
        console.log(`\n📭 No commands saved in ${cat}\n`);
        return;
      }

      const answer = await ask(
        `\n⚠️  Clear all ${data[cat].length} ${cat} commands? (yes/no): `
      );

      if (answer.toLowerCase() !== "yes") {
        console.log("❌ Cancelled\n");
        return;
      }

      data[cat] = [];
      fs.writeFileSync(COMMANDS_FILE, JSON.stringify(data, null, 2));
      console.log(`\n✅ Cleared all ${cat} commands\n`);
      return;
    }

    const total = Object.values(data).reduce(
      (sum, commands) => sum + commands.length, 0
    );

    if (total === 0) {
      console.log("\n📭 No commands saved yet\n");
      return;
    }

    const answer = await ask(
      `\n⚠️  Clear ALL ${total} saved commands? This cannot be undone! (yes/no): `
    );

    if (answer.toLowerCase() !== "yes") {
      console.log("❌ Cancelled\n");
      return;
    }

    const emptyData = {
      git: [], npm: [], docker: [], linux: [],
      node: [], angular: [], python: [], others: []
    };

    fs.writeFileSync(COMMANDS_FILE, JSON.stringify(emptyData, null, 2));
    console.log(`\n✅ Cleared all ${total} saved commands\n`);

  } catch (error) {
    console.log("\n❌ Error clearing commands");
    console.log("💡 Try running tracker init again\n");
  }
}

export { clearCommand };
