/*
 * list.js
 *
 * Handles "tracker list" and "tracker list <category>" commands
 * Now with proper error handling using validator.js
 */

const { readCommands } = require('../utils/storage');
const colors = require('../utils/colors');
const {
  isInitialized,
  showInitError,
  isValidCategory,
  showCategoryError
} = require('../utils/validator');

function listCommand(category) {

  /*
   * Check if tracker init was run first
   * If not — show helpful error and stop
   */
  if (!isInitialized()) {
    showInitError();
    return;
  }

  /*
   * If category provided — validate it
   */
  if (category) {
    if (!isValidCategory(category)) {
      showCategoryError(category);
      return;
    }

    const data = readCommands();
    const cat = category.toLowerCase();
    displayCategory(cat, data[cat]);
    return;
  }

  /*
   * No category — show all commands
   */
  try {
    const data = readCommands();
    let totalCommands = 0;

    console.log(colors.heading('\n📟 CMD-TRACKER — Your Command History\n'));
    console.log(colors.dim('─'.repeat(50)));

    for (const [cat, commands] of Object.entries(data)) {
      if (commands.length === 0) continue;
      displayCategory(cat, commands);
      totalCommands += commands.length;
    }

    if (totalCommands === 0) {
      console.log('\n📭 No commands saved yet!');
      console.log('💡 Use: tracker save "your command"');
      console.log('💡 Or run commands normally if shell hook is set up\n');
      return;
    }

    console.log('─'.repeat(50));
    console.log(colors.success(`\n✅ Total: ${totalCommands} commands saved\n`));

  } catch (error) {
    /*
     * Something went wrong reading the file
     * Show clear error instead of crashing
     */
    console.log('\n❌ Error reading commands');
    console.log('💡 Try running tracker init again\n');
  }
}


function displayCategory(categoryName, commands) {

  const icons = {
    git:     '🔀',
    npm:     '📦',
    docker:  '🐳',
    linux:   '🐧',
    node:    '🟢',
    angular: '🔴',
    python:  '🐍',
    go:      '🔷',
    java:    '☕',
    rust:    '🦀',
    dotnet:  '🔵',
    kubernetes: '☸️',
    database: '🗄️',
    cloud:   '☁️',
    packagemanagers: '📥',
    testing: '🧪',
    ai:      '🤖',
    others:  '📌'
  };

  const icon = icons[categoryName] || '📌';
  const categoryColor = colors.getCategoryColor(categoryName);

  console.log(`\n${icon}  ${categoryColor.bold(categoryName.toUpperCase())} ${colors.dim(`(${commands.length})`)}`);
  console.log(colors.dim('─'.repeat(30)));

  if (commands.length === 0) {
    console.log(colors.dim('  📭 No commands saved yet'));
    return;
  }

  commands.forEach((item, index) => {
    const date = new Date(item.time).toLocaleDateString();
    console.log(`  ${colors.dim(String(index + 1).padStart(2, ' ') + '.')} ${item.command}  ${colors.dim(`(${date})`)}`);
  });
}

module.exports = { listCommand };
