/*
 * index.js — Main entry point when package is required
 *
 * This file is used when someone does:
 * const tracker = require('@adithya-naik/cmd-tracker')
 *
 * We export our core utilities so developers can
 * use them programmatically in their own code
 */

const { saveCommand, readCommands, initStorage } = require("./utils/storage");
const { categorize } = require("./utils/categorizer");

module.exports = {
  saveCommand,
  readCommands,
  initStorage,
  categorize
};