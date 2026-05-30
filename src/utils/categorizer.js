/*
 * categorizer.js
 *
 * This file has ONE job — look at a command and decide its category
 * Example:
 *   "git status"      → "git"
 *   "npm install"     → "npm"
 *   "docker ps"       → "docker"
 *   "ls -la"          → "linux"
 *   "ng new my-app"   → "others"
 */

/*
 * We define all our categories and their keywords here
 * This is called a CONFIGURATION OBJECT
 *
 * Why keep it here separately?
 * → Easy to add new categories later
 * → Easy to add new keywords to existing categories
 * → Everything in one place — no hunting around in code
 */
const CATEGORIES = {

    /*
     * Any command starting with "git" goes here
     * Examples: git status, git push, git commit -m "msg"
     */
    git: ["git"],

    /*
     * Any command starting with "npm" or "npx" goes here
     * Examples: npm install, npm run dev, npx create-react-app
     */
    npm: ["npm", "npx"],

    /*
     * Any command starting with "docker" goes here
     * Examples: docker ps, docker build, docker-compose up
     */
    docker: ["docker", "docker-compose"],

    /*
     * Common linux commands go here
     * Examples: ls -la, cd projects, mkdir new-folder
     */
    linux: [
        "ls", "cd", "pwd", "mkdir", "rmdir",
        "rm", "cp", "mv", "cat", "touch",
        "chmod", "chown", "grep", "find",
        "echo", "sudo", "apt", "apt-get",
        "curl", "wget", "nano", "vim",
        "less", "head", "tail", "ps",
        "top", "kill", "df", "du",
        "tar", "zip", "unzip", "ssh",
        "scp", "rsync"
    ],

    /*
     * Node.js related commands
     * Examples: node index.js, nodemon server.js
     */
    node: ["node", "nodemon"],

    /*
     * Angular CLI commands
     * Examples: ng new my-app, ng serve, ng generate component
     */
    angular: ["ng"],

    /*
     * Python commands
     * Examples: python app.py, pip install flask
     */
    python: ["python", "python3", "pip", "pip3"],

    /*
     * Go commands
     * Examples: go run main.go, go get github.com/pkg/errors
     *           go install github.com/user/tool@latest
     */
    go: ["go"],

    /*
     * Java ecosystem commands
     * Examples: java Main, javac Main.java,
     *           mvn package, gradle build
     */
    java: ["java", "javac", "mvn", "gradle"],

    /*
     * Rust development commands
     * Examples: cargo build, cargo run,
     *           cargo test, rustc main.rs
     */
    rust: ["cargo", "rustc"],

    /*
     * .NET commands
     * Examples: dotnet run, dotnet build,
     *           dotnet new console
     */
    dotnet: ["dotnet"],

    /*
     * Kubernetes tooling commands
     * Examples: kubectl get pods,
     *           kubectl apply -f app.yaml,
     *           helm install my-app chart/
     */
    kubernetes: ["kubectl", "helm"],

    /*
     * Database CLI commands
     * Examples: mysql -u root -p,
     *           psql mydb,
     *           mongosh,
     *           redis-cli
     */
    database: [
        "mysql",
        "psql",
        "sqlite3",
        "mongosh",
        "redis-cli"
    ],

    /*
     * Cloud provider CLI commands
     * Examples: aws s3 ls,
     *           gcloud compute instances list,
     *           az login
     */
    cloud: [
        "aws",
        "gcloud",
        "az"
    ],

    /*
     * Package manager commands
     * Examples: yarn install,
     *           pnpm dev,
     *           brew install git,
     *           snap install code
     */
    packageManagers: [
        "yarn",
        "pnpm",
        "brew",
        "snap"
    ],

    /*
     * Testing framework commands
     * Examples: jest,
     *           vitest run,
     *           playwright test,
     *           cypress open
     */
    testing: [
        "jest",
        "vitest",
        "playwright",
        "cypress"
    ],

    /*
 * AI coding assistant CLI commands
 * Examples: claude, gemini, codex,
 *           opencode, aider, q chat
 */
    ai: [
        "claude",
        "gemini",
        "codex",
        "c",
        "opencode",
        "aider",
        "q",
        "warp"
    ],
};

/*
 * categorize() — the main function of this file
 *
 * It takes a command string as input
 * It returns the category name as a string
 *
 * @param {string} command - the terminal command typed by user
 * @returns {string} - category name (git/npm/docker/linux/node/angular/python/others)
 *
 * Example:
 *   categorize("git status")  → "git"
 *   categorize("npm install") → "npm"
 *   categorize("ng serve")    → "angular"
 *   categorize("abc xyz")     → "others"
 */
function categorize(command) {

    /*
     * Safety check — if command is empty or not a string, return "others"
     * This prevents crashes if something unexpected is passed in
     */
    if (!command || typeof command !== "string") {
        return "others";
    }

    /*
     * .trim() → removes spaces from start and end
     * .toLowerCase() → converts to lowercase so "Git Status" = "git status"
     * .split(" ")[0] → takes only the FIRST word
     *
     * Example:
     *   "  git status  " → trim → "git status"
     *                    → toLowerCase → "git status"
     *                    → split(" ") → ["git", "status"]
     *                    → [0] → "git"
     */
    const firstWord = command.trim().toLowerCase().split(" ")[0];

    /*
     * Object.entries() converts our CATEGORIES object into an array like:
     * [
     *   ["git", ["git"]],
     *   ["npm", ["npm", "npx"]],
     *   ...
     * ]
     *
     * We loop through each [categoryName, keywords] pair
     */
    for (const [categoryName, keywords] of Object.entries(CATEGORIES)) {

        /*
         * .includes() checks if our firstWord exists in the keywords array
         *
         * Example:
         *   categoryName = "npm"
         *   keywords = ["npm", "npx"]
         *   firstWord = "npx"
         *   keywords.includes("npx") → true → return "npm"
         */
        if (keywords.includes(firstWord)) {
            return categoryName;
        }
    }

    /*
     * If no category matched — return "others"
     * This is our catch-all category
     */
    return "others";
}

/*
 * module.exports → makes this function available to other files
 * Without this line — no other file can use categorize()
 *
 * This is how Node.js shares code between files
 */
module.exports = { categorize };
