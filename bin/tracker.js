#!/usr/bin/env node
// "Hey! Run this file using Node.js"

/*
 * This is the ENTRY POINT of our CLI tool
 * When user types "tracker" in terminal, this file runs first
 * Think of it like the main gate of our entire application
 */

// Import commander - this package helps us build CLI commands easily
// Like "list", "stats", "search" etc.
const { program } = require("commander");

// Import package.json to read our version number
// __dirname = current folder path (bin/)
// ../ = go one level up (to root of project)
const packageJson = require("../package.json");

/*
 * .name() → sets the name of our CLI tool
 * This shows up when user types: tracker --help
 */
program.name("tracker");

/*
 * .description() → explains what our tool does
 * This also shows up in: tracker --help
 */
program.description("📟 A developer tool that auto-captures, categorizes and saves terminal commands per project for easy revision");

/*
 * .version() → sets the version of our CLI tool
 * packageJson.version reads "1.0.0" from package.json
 * So we never have to update version in two places
 * User can check version by typing: tracker --version
 */
program.version(packageJson.version);

/*
 * This line is VERY important
 * It tells commander to start reading what the user typed
 * Without this line - nothing works
 * Always keep this at the BOTTOM of this file
 */
program.parse(process.argv);