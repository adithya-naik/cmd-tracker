/*
 * init.js
 * Now with proper error handling
 *
 * Error cases handled:
 * → Already initialized (runs tracker init twice)
 * → No write permissions in folder
 * → Any unexpected file system errors
 */

const fs = require('fs');
const path = require('path');
const { initStorage } = require('../utils/storage');
const { isInitialized } = require('../utils/validator');

function initCommand() {

  console.log('🚀 Initializing cmd-tracker in your project...\n');

  try {

    /*
     * Check if already initialized
     * If user runs tracker init twice — warn them
     * but still continue in case files are corrupted
     */
    if (isInitialized()) {
      console.log('⚠️  cmd-tracker is already initialized in this project!');
      console.log('💡 Your existing commands are safe');
      console.log('💡 Running init again will not delete your saved commands\n');
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

    console.log('\n✅ cmd-tracker initialized successfully!');
    console.log('📁 Created .tracker/commands.json in your project');
    console.log('\n🎯 You can now use:');
    console.log('   tracker list     → see all saved commands');
    console.log('   tracker stats    → see command statistics');
    console.log('   tracker search   → search your commands');
    console.log('   tracker export   → export your commands');
    console.log('\n💡 Start using your terminal normally');
    console.log('   Commands will be saved automatically!\n');

  } catch (error) {

    /*
     * Handle specific error types
     *
     * error.code === "EACCES" → permission denied
     * This happens when user doesn't have write access
     * to the current folder
     */
    if (error.code === 'EACCES') {
      console.error('❌ Permission denied!');
      console.error('💡 Try running with admin permissions');
      console.error('💡 Or check folder write permissions\n');
      return;
    }

    /*
     * Handle no space left on disk
     */
    if (error.code === 'ENOSPC') {
      console.error('❌ No space left on disk!');
      console.error('💡 Free up some disk space and try again\n');
      return;
    }

    /*
     * Any other unexpected error
     */
    console.error('❌ Failed to initialize cmd-tracker');
    console.error(`Error: ${error.message}\n`);
  }
}

function updateGitignore() {

  const gitignorePath = path.join(process.cwd(), '.gitignore');
  /*
   * Added tracker-export files to gitignore too
   * Users should not push their exported files to GitHub
   * These are personal revision files — local only
   */
  const trackerEntry = '\n# cmd-tracker personal data\n.tracker/\ntracker-export.json\ntracker-export.csv\n';

  try {

    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');

      /*
       * Check each entry separately
       * So we can add missing entries without touching existing ones
       */
      let entriesToAdd = '';

      if (!gitignoreContent.includes('.tracker/')) {
        entriesToAdd += '.tracker/\n';
      }

      if (!gitignoreContent.includes('tracker-export.json')) {
        entriesToAdd += 'tracker-export.json\n';
      }

      if (!gitignoreContent.includes('tracker-export.csv')) {
        entriesToAdd += 'tracker-export.csv\n';
      }

      /*
       * Only write if there's something new to add
       */
      if (entriesToAdd === '') {
        console.log('✅ .gitignore already up to date');
        return;
      }

      fs.appendFileSync(
        gitignorePath,
        '\n# cmd-tracker personal data\n' + entriesToAdd
      );
      console.log('✅ Updated .gitignore with cmd-tracker entries');

      fs.appendFileSync(gitignorePath, trackerEntry);
      console.log('✅ Added .tracker/ to your .gitignore');

    } else {
      fs.writeFileSync(gitignorePath, trackerEntry);
      console.log('✅ Created .gitignore with .tracker/ entry');
    }

  } catch (error) {

    /*
     * .gitignore update failed — not critical
     * tracker still works, just warn the user
     */
    console.log('⚠️  Could not update .gitignore automatically');
    console.log('💡 Manually add .tracker/ to your .gitignore\n');
  }
}

module.exports = { initCommand };