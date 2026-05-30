/*
 * index.js — Main entry point when package is required
 *
 * This file is used when someone does:
 * const tracker = require('@adithya-naik/cmd-tracker')
 *
 * We export our core utilities so developers can
 * use them programmatically in their own code
 */

import { saveCommand, readCommands, initStorage } from "./utils/storage.js";
import { categorize } from "./utils/categorizer.js";

export {
  saveCommand,
  readCommands,
  initStorage,
  categorize
};