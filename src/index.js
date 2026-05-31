/*
 * index.js — Main entry point for programmatic usage (ESM)
 *
 * This file is used when someone does:
 * import { saveCommand, readCommands } from '@adithya-naik/cmd-tracker'
 *
 * We export our core utilities so developers can
 * use them programmatically in their own code
 */

export { saveCommand }   from "./commands/save.js";
export { readCommands }  from "./utils/storage.js";
export { initStorage }   from "./utils/storage.js";
export { categorize }    from "./utils/categorizer.js";
