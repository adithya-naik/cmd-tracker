/*
 * validator.js
 *
 * Central validation utility for all commands
 * Instead of repeating checks in every command file
 * we put all validation logic here in one place
 *
 * This is called the DRY principle:
 * DRY = Don't Repeat Yourself
 * Write once, use everywhere ✅
 */

const fs = require('fs');
const path = require('path');

/*
 * Path to .tracker folder
 * process.cwd() → user's current project folder
 */
const TRACKER_DIR = path.join(process.cwd(), '.tracker');
const COMMANDS_FILE = path.join(TRACKER_DIR, 'commands.json');

/*
 * isInitialized() — checks if tracker init was run
 *
 * Before any command works — .tracker/commands.json must exist
 * If user skips tracker init and runs tracker list
 * we catch it here and guide them
 *
 * @returns {boolean} — true if initialized, false if not
 */
function isInitialized() {
  return fs.existsSync(TRACKER_DIR) && fs.existsSync(COMMANDS_FILE);
}

/*
 * showInitError() — shows helpful error when not initialized
 *
 * Instead of a confusing crash — user sees a clear message
 * telling them exactly what to do next
 */
function showInitError() {
  console.log('\n❌ cmd-tracker is not initialized in this project!');
  console.log('💡 Run this first: tracker init\n');
}

/*
 * isValidCategory() — checks if category name is valid
 *
 * @param {string} category — category name to validate
 * @returns {boolean} — true if valid, false if not
 */
function isValidCategory(category) {
  const validCategories = [
    'git',
    'npm',
    'docker',
    'linux',
    'node',
    'angular',
    'python',
    'go',
    'java',
    'rust',
    'dotnet',
    'kubernetes',
    'database',
    'cloud',
    'packagemanagers',
    'testing',
    'ai',
    'others'
  ];
  return validCategories.includes(category.toLowerCase());
}

/*
 * showCategoryError() — shows helpful error for invalid category
 *
 * @param {string} category — the invalid category user typed
 */
function showCategoryError(category) {
  console.log(`\n❌ Unknown category: "${category}"`);
  console.log('📋 Valid categories: git, npm, docker, linux, node, angular, python, go, java, rust, dotnet, kubernetes, database, cloud, packageManagers, testing, ai, others\n');
}

/*
 * isValidQuery() — checks if search query is valid
 *
 * @param {string} query — search term to validate
 * @returns {boolean} — true if valid, false if not
 */
function isValidQuery(query) {
  /*
   * Query must exist and have at least 1 character after trimming
   */
  return query && query.trim().length > 0;
}

/*
 * Export all validators
 * Every command file will import what it needs from here
 */
module.exports = {
  isInitialized,
  showInitError,
  isValidCategory,
  showCategoryError,
  isValidQuery
};
