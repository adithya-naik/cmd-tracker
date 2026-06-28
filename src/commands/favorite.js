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

const { toggleFavorite, getFavorites } = require("../utils/storage");
const { isInitialized, showInitError } = require("../utils/validator");
const colors = require("../utils/colors");
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
    console.log(colors.error("\n❌ Please provide a command to favorite"));
    console.log(colors.info('💡 Usage: ') + colors.bold('tracker favorite "git status"') + "\n");
    return;
  }

  try {
    const result = toggleFavorite(command.trim());

    if (!result.success) {
      if (result.reason === "command not found") {
        console.log(colors.error(`\n❌ Command not found: "${command}"`));
        console.log(colors.info("💡 Run ") + colors.bold("tracker list") + colors.info(" to see saved commands\n"));
        return;
      }
      console.log(colors.error("\n❌ Failed to update favorite\n"));
      return;
    }

    if (result.action === "added") {
      console.log(colors.warning(`\n⭐ Added to favorites: `) + command);
      console.log(colors.dim("📁 Category: ") + categoryColor(result.category) + "\n");
    } else {
      console.log(colors.success(`\n✅ Removed from favorites: ${command}\n`));
    }

  } catch (error) {
    console.log(colors.error("\n❌ Error updating favorite"));
    console.log(colors.info("💡 Try running tracker init again\n"));
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
      console.log(colors.warning("\n⭐ No favorites yet!"));
      console.log(colors.info('💡 Usage: ') + colors.bold('tracker favorite "git status"') + "\n");
      return;
    }

    console.log(colors.heading("\n⭐ CMD-TRACKER — Your Favorites\n"));
    console.log(colors.dim("─".repeat(50)));

    favorites.forEach((item, index) => {
      const date = new Date(item.time).toLocaleDateString();
      const categoryColor = colors.getCategoryColor(item.category);

      console.log(`\n  ${colors.dim(index + 1 + ".")} ${item.command}`);
      console.log(`     📁 ${categoryColor(item.category)}  ${colors.dim("📅 " + date)}`);
    });

    console.log("\n" + colors.dim("─".repeat(50)));
    console.log(colors.success(`⭐ Total favorites: ${favorites.length}\n`));

  } catch (error) {
    console.log(colors.error("\n❌ Error reading favorites\n"));
  }
}

module.exports = { favoriteCommand, favoritesCommand };