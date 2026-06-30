/*
 * colors.js
 *
 * Central place for all our chalk color definitions
 * Instead of importing chalk in every file and guessing colors
 * we define a consistent color scheme here ONCE
 *
 * This makes it easy to:
 * → Change the whole theme later by editing one file
 * → Keep colors consistent across all commands
 */

const chalk = require('chalk');

/*
 * Category colors — each category gets a distinct color
 * matching its icon for visual consistency
 */
const categoryColors = {
  git: chalk.hex('#f05033'),
  npm: chalk.red,
  docker: chalk.cyan,
  linux: chalk.green,
  node: chalk.greenBright,
  angular: chalk.red,
  python: chalk.yellow,
  go: chalk.cyan,
  java: chalk.hex('#f89820'),
  rust: chalk.hex('#dea584'),
  dotnet: chalk.magenta,
  kubernetes: chalk.blue,
  database: chalk.yellow,
  cloud: chalk.blueBright,
  packagemanagers: chalk.magenta,
  testing: chalk.greenBright,
  ai: chalk.magentaBright,
  others: chalk.gray,
};

/*
 * getCategoryColor() — returns the chalk color function for a category
 * Falls back to gray if category isn't in our map
 */
function getCategoryColor(category) {
  return categoryColors[category] || chalk.white;
}

/*
 * Semantic colors — used for general messages
 * Keeping these consistent across the whole CLI
 */
const success = chalk.green;
const error = chalk.red;
const warning = chalk.yellow;
const info = chalk.cyan;
const dim = chalk.gray;
const bold = chalk.bold;
const heading = chalk.bold.white;

module.exports = {
  getCategoryColor,
  success,
  error,
  warning,
  info,
  dim,
  bold,
  heading,
};