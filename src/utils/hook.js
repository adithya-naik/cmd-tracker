/*
 * hook.js
 *
 * This file handles the shell hook setup
 * Shell hook = a small script added to user's shell config
 * that runs automatically after EVERY command they type
 *
 * Supported shells:
 * → bash → hooks into ~/.bashrc
 * → zsh  → hooks into ~/.zshrc
 * → fish → hooks into ~/.config/fish/config.fish
 *
 * How it works:
 * 1. Detect user's shell (bash, zsh, or fish)
 * 2. Add a hook script to their shell config file
 * 3. Hook script calls "tracker save <command>" after every command
 * 4. User sources their config → automatic capture starts!
 */

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

/*
 * os module — built into Node.js
 * os.homedir() → gives home directory path
 * Windows → C:\Users\Adithya
 * Mac/Linux → /home/adithya
 */
const HOME_DIR = os.homedir();
/*
 * Shell config file paths
 * These are standard locations for shell config files
 */
const SHELL_CONFIGS = {
  bash: path.join(HOME_DIR, '.bashrc'),
  zsh: path.join(HOME_DIR, '.zshrc'),
  fish: path.join(HOME_DIR, '.config/fish/config.fish'),

};

/*
 * This is the actual hook script we add to shell config
 * It runs after every command the user types
 *
 * How it works line by line:
 *
 * _cmd_tracker_hook() → defines a function
 * LAST_CMD=$(history 1 | sed ...) → gets the last command typed
 * tracker save "$LAST_CMD" → saves it using our CLI
 *
 * precmd() → zsh hook that runs before each prompt (zsh only)
 * PROMPT_COMMAND → bash variable that runs before each prompt (bash only)
 */
/*
 * HOOK_SCRIPT — the shell script we add to user's config
 *
 * IMPORTANT: We use regular string (single quotes) NOT template literal
 * Because ${PROMPT_COMMAND} is a BASH variable not a JavaScript variable
 * If we use backticks → JavaScript tries to read PROMPT_COMMAND as JS variable
 * If we use regular string → it stays as plain text ✅
 */
/*
 * HOOK_SCRIPT — shell script added to user's config
 *
 * The sed command had escaped quote issues before
 * Fix: use [[:space:]] instead of [ ] and avoid nested quotes
 * This is cleaner and works on all bash/zsh versions
 */
const HOOK_SCRIPT = [
  '',
  '# cmd-tracker shell hook — auto saves every command you type',
  '_cmd_tracker_hook() {',
  '  local LAST_CMD',
  '  LAST_CMD=$(history 1 | sed \'s/^[[:space:]]*[0-9]*[[:space:]]*//\')',
  '  if [ -n "$LAST_CMD" ]; then',
  '    tracker save "$LAST_CMD" > /dev/null 2>&1',
  '  fi',
  '}',
  '',
  '# For zsh',
  'if [ -n "$ZSH_VERSION" ]; then',
  '  autoload -U add-zsh-hook',
  '  add-zsh-hook precmd _cmd_tracker_hook',
  'fi',
  '',
  '# For bash',
  'if [ -n "$BASH_VERSION" ]; then',
  '  PROMPT_COMMAND="_cmd_tracker_hook${PROMPT_COMMAND:+;$PROMPT_COMMAND}"',
  'fi',
  ''
].join('\n');


const FISH_HOOK_SCRIPT = [
  '',
  '# cmd-tracker shell hook — auto saves every command you type',
  'function __cmd_tracker_postexec --on-event fish_postexec',
  '    set -l last_cmd (history --max=1)',
  '',
  '    if test -n "$last_cmd"',
  '        tracker save "$last_cmd" >/dev/null 2>&1',
  '    end',
  'end',
  '',
].join('\n');


/*
 * HOOK_MARKER — unique string we add to identify our hook
 * We use this to:
 * → Check if hook already exists (avoid duplicates)
 * → Find and remove hook when user runs tracker unhook
 */
const HOOK_MARKER = '# cmd-tracker shell hook — auto saves every command you type';

/*
 * detectShell() — detects which shell user is running
 *
 * Priority:
 * 1. process.env.FISH_VERSION — fish sets this automatically
 *    even when launched from another shell (parent $SHELL
 *    would still show bash/zsh)
 * 2. process.env.SHELL — the standard shell path variable
 *    Examples: "/bin/bash" → bash, "/bin/zsh" → zsh
 *
 * @returns {string} — "bash", "zsh", "fish", or "unknown"
 */
function detectShell() {
  const shell = process.env.SHELL || '';

  if (process.env.FISH_VERSION) return 'fish';

  if (shell.includes('fish')) return 'fish';

  try {
    const ppid = process.ppid;
    const { execFileSync } = require('node:child_process');
    const comm = execFileSync('/bin/ps', ['-o', 'comm=', '-p', String(ppid)], { encoding: 'utf-8' }).trim();
    if (comm.includes('fish')) return 'fish';
    if (comm.includes('zsh')) return 'zsh';
    if (comm.includes('bash')) return 'bash';
  } catch {
    // ignore ps command errors
  }

  if (shell.includes('zsh')) return 'zsh';
  if (shell.includes('bash')) return 'bash';

  const comspec = process.env.ComSpec || '';
  if (comspec.includes('cmd.exe')) return 'unknown';

  return 'unknown';
}

/*
 * getConfigFile() — returns path to shell config file
 *
 * @param {string} shell — "bash" or "zsh"
 * @returns {string} — full path to config file
 */
function getConfigFile(shell) {
  return SHELL_CONFIGS[shell] || SHELL_CONFIGS.bash;
}

/*
 * installHook() — adds hook script to shell config
 *
 * @returns {object} — { success: true/false, shell, configFile, message }
 */
function installHook() {

  try {
    const shell = detectShell();

    /*
     * If shell is unknown — we can't install hook
     * This happens on Windows CMD/PowerShell
     */
    if (shell === 'unknown') {
      return {
        success: false,
        message: '❌ Automatic hook not supported on Windows CMD/PowerShell\n💡 Use Git Bash or WSL for automatic capture'
      };
    }

    const configFile = getConfigFile(shell);

    /*
     * Check if hook already installed
     * Look for our unique marker in the config file
     */
    if (fs.existsSync(configFile)) {
      const content = fs.readFileSync(configFile, 'utf-8');

      if (content.includes(HOOK_MARKER)) {
        return {
          success: false,
          message: `⚠️  Hook already installed in ${configFile}`
        };
      }
    }

    /*
     * Append hook script to shell config file
     * appendFileSync → adds to end without deleting existing content
     */
    if (shell === 'fish') {
      fs.mkdirSync(path.dirname(configFile), { recursive: true });
    }

    /*
         * Choose correct hook
         */
    const hookScript =
            shell === 'fish' ? FISH_HOOK_SCRIPT : HOOK_SCRIPT;

    fs.appendFileSync(configFile, hookScript);

    return {
      success: true,
      shell,
      configFile,
      message: `✅ Hook installed in ${configFile}`
    };

  } catch (error) {

    if (error.code === 'EACCES') {
      return {
        success: false,
        message: '❌ Permission denied! Try with sudo/admin permissions'
      };
    }

    return {
      success: false,
      message: `❌ Failed to install hook: ${error.message}`
    };
  }
}

/*
 * removeHook() — removes hook script from shell config
 *
 * @returns {object} — { success: true/false, message }
 */
function removeHook() {

  try {
    const shell = detectShell();
    const configFile = getConfigFile(shell);

    if (!fs.existsSync(configFile)) {
      return {
        success: false,
        message: '❌ Shell config file not found'
      };
    }

    const content = fs.readFileSync(configFile, 'utf-8');

    /*
     * Check if hook exists
     */
    if (!content.includes(HOOK_MARKER)) {
      return {
        success: false,
        message: '⚠️  Hook not found in shell config'
      };
    }

    /*
     * Remove hook script from config
     * Split by marker → take everything before it
     * Then trim trailing whitespace
     */
    const newContent = content.split(HOOK_MARKER)[0].trimEnd() + '\n';
    fs.writeFileSync(configFile, newContent);

    return {
      success: true,
      configFile,
      message: `✅ Hook removed from ${configFile}`
    };

  } catch (error) {
    return {
      success: false,
      message: `❌ Failed to remove hook: ${error.message}`
    };
  }
}

/*
 * isHookInstalled() — checks if hook is already installed
 *
 * @returns {boolean}
 */
function isHookInstalled() {
  try {
    const shell = detectShell();
    const configFile = getConfigFile(shell);

    if (!fs.existsSync(configFile)) return false;

    const content = fs.readFileSync(configFile, 'utf-8');
    return content.includes(HOOK_MARKER);

  } catch (error) {
    return false;
  }
}

module.exports = {
  installHook,
  removeHook,
  isHookInstalled,
  detectShell
};
