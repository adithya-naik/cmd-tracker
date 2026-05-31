/*
 * favorite.js
 *
 * Handles two commands:
 * tracker favorite "git status" → toggles favorite on that command
 * tracker favorites             → lists all favorited commands
 *
 * Favorites are stored as { favorite: true } on each command object
 * in commands.json
 */

import { toggleFavorite, getFavorites } from "../utils/storage.js";
import { isInitialized, showInitError } from "../utils/validator.js";

/*
 * favoriteCommand() — toggles favorite on a specific command
 *
 * @param {string} command — command to favorite/unfavorite
 */
function favoriteCommand(command) {

  if (!isInitialized()) {
    showInitError();
    return;
  }

  if (!command || !command.trim()) {
    console.log("\n❌ Please provide a command to favorite");
    console.log("💡 Usage: tracker favorite \"git status\"\n");
    return;
  }

  try {
    const result = toggleFavorite(command.trim());

    if (!result.success) {
      if (result.reason === "command not found") {
        console.log(`\n❌ Command not found: "${command}"`);
        console.log("💡 Run tracker list to see saved commands\n");
        return;
      }
      console.log("\n❌ Failed to update favorite\n");
      return;
    }

    if (result.action === "added") {
      console.log(`\n⭐ Added to favorites: ${command}`);
      console.log(`📁 Category: ${result.category}\n`);
    } else {
      console.log(`\n✅ Removed from favorites: ${command}\n`);
    }

  } catch (error) {
    console.log("\n❌ Error updating favorite");
    console.log("💡 Try running tracker init again\n");
  }
}

/*
 * favoritesCommand() — lists all favorited commands
 */
function favoritesCommand() {

  if (!isInitialized()) {
    showInitError();
    return;
  }

  try {
    const favorites = getFavorites();

    if (favorites.length === 0) {
      console.log("\n⭐ No favorites yet!");
      console.log("💡 Usage: tracker favorite \"git status\"\n");
      return;
    }

    console.log("\n⭐ CMD-TRACKER — Your Favorites\n");
    console.log("─".repeat(50));

    favorites.forEach((item, index) => {
      const date = new Date(item.time).toLocaleDateString();
      console.log(`\n  ${index + 1}. ${item.command}`);
      console.log(`     📁 ${item.category}  📅 ${date}`);
    });

    console.log("\n" + "─".repeat(50));
    console.log(`⭐ Total favorites: ${favorites.length}\n`);

  } catch (error) {
    console.log("\n❌ Error reading favorites\n");
  }
}

export { favoriteCommand, favoritesCommand };
