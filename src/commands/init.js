/*
 * init.js
 * Now with proper error handling
 *
 * Error cases handled:
 * → Already initialized (runs tracker init twice)
 * → No write permissions in folder
 * → Any unexpected file system errors
 */

const fs = require("fs");
const path = require("path");
const { initStorage } = require("../utils/storage");
const { isInitialized } = require("../utils/validator");
const colors = require("../utils/colors");

function initCommand() {

  console.log(colors.heading("🚀 Initializing cmd-tracker in your project...\n"));

  try {

    /*
     * Check if already initialized
     * If user runs tracker init twice — warn them
     * but still continue in case files are corrupted
     */
    if (isInitialized()) {
      console.log(colors.warning("⚠️  cmd-tracker is already initialized in this project!"));
      console.log(colors.info("💡 Your existing commands are safe"));
      console.log(colors.info("💡 Running init again will not delete your saved commands\n"));
    }

    /*
     * Initialize storage — creates .tracker folder
     * and commands.json if they don't exist
     */
    initStorage();

    /*
     * Update .gitignore
     */
    updateGitignore();

    console.log(colors.success("\n✅ cmd-tracker initialized successfully!"));
    console.log(colors.dim("📁 Created .tracker/commands.json in your project"));
    console.log(colors.heading("\n🎯 You can now use:"));
    console.log(colors.info("   tracker list     ") + colors.dim("→ see all saved commands"));
    console.log(colors.info("   tracker stats    ") + colors.dim("→ see command statistics"));
    console.log(colors.info("   tracker search   ") + colors.dim("→ search your commands"));
    console.log(colors.info("   tracker export   ") + colors.dim("→ export your commands"));
    console.log(colors.dim("\n💡 Start using your terminal normally"));
    console.log(colors.dim("   Commands will be saved automatically!\n"));
  } catch (error) {

    /*
     * Handle specific error types
     *
     * error.code === "EACCES" → permission denied
     * This happens when user doesn't have write access
     * to the current folder
     */
    if (error.code === "EACCES") {
      console.error(colors.error("❌ Permission denied!"));
      console.error(colors.info("💡 Try running with admin permissions"));
      console.error(colors.info("💡 Or check folder write permissions\n"));
      return;
    }

    /*
     * Handle no space left on disk
     */
    if (error.code === "ENOSPC") {
      console.error(colors.error("❌ No space left on disk!"));
      console.error(colors.info("💡 Free up some disk space and try again\n"));
      return;
    }

    /*
     * Any other unexpected error
     */
    console.error(colors.error("❌ Failed to initialize cmd-tracker"));
    console.error(colors.error(`Error: ${error.message}\n`));
  }
}

function updateGitignore() {

  const gitignorePath = path.join(process.cwd(), ".gitignore");
  /*
   * Added tracker-export files to gitignore too
   * Users should not push their exported files to GitHub
   * These are personal revision files — local only
   */
  const trackerEntry = "\n# cmd-tracker personal data\n.tracker/\ntracker-export.json\ntracker-export.csv\n";

  try {

    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");

      /*
       * Check each entry separately
       * So we can add missing entries without touching existing ones
       */
      let entriesToAdd = "";

      if (!gitignoreContent.includes(".tracker/")) {
        entriesToAdd += ".tracker/\n";
      }

      if (!gitignoreContent.includes("tracker-export.json")) {
        entriesToAdd += "tracker-export.json\n";
      }

      if (!gitignoreContent.includes("tracker-export.csv")) {
        entriesToAdd += "tracker-export.csv\n";
      }

      /*
       * Only write if there's something new to add
       */
      if (entriesToAdd === "") {
        console.log(colors.success("✅ .gitignore already up to date"));
        return;
      }

      fs.appendFileSync(
        gitignorePath,
        "\n# cmd-tracker personal data\n" + entriesToAdd
      );
      console.log(colors.success("✅ Updated .gitignore with cmd-tracker entries"));

      fs.appendFileSync(gitignorePath, trackerEntry);
      console.log(colors.success("✅ Added .tracker/ to your .gitignore"));

    } else {
      fs.writeFileSync(gitignorePath, trackerEntry);
      console.log(colors.success("✅ Created .gitignore with .tracker/ entry"));
    }

  } catch (error) {

    /*
     * .gitignore update failed — not critical
     * tracker still works, just warn the user
     */
    console.log(colors.warning("⚠️  Could not update .gitignore automatically"));
    console.log(colors.info("💡 Manually add .tracker/ to your .gitignore\n"));
  }
}

module.exports = { initCommand };