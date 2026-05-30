/*
 * save.js
 * Now with proper error handling
 *
 * Error cases handled:
 * → tracker not initialized
 * → empty command
 * → file write failures
 * → any unexpected errors
 *
 * Important: ALL errors are silent here
 * save runs automatically in background
 * We NEVER want it to interrupt user's workflow
 */

import { saveCommand } from "../utils/storage.js";
import { isInitialized } from "../utils/validator.js";

function saveCommandAction(command) {

  /*
   * Safety check — empty command
   * Return silently — no error message needed
   */
  if (!command || !command.trim()) {
    return;
  }

  /*
   * Check if tracker is initialized
   *
   * Unlike other commands — we fail SILENTLY here
   * Because save runs automatically via shell hook
   * Showing errors every time would be very annoying
   * for users who haven't run tracker init yet
   */
  if (!isInitialized()) {
    return;
  }

  try {

    const result = saveCommand(command);

    /*
     * Only show output when command is newly saved
     * Stay silent for duplicates
     */
    if (result.saved) {
      console.log(`✅ Saved [${result.category}]: ${command}`);
    }

  } catch (error) {

    /*
     * Fail completely silently
     * Never interrupt user's terminal workflow
     */
    return;
  }
}

export { saveCommandAction };