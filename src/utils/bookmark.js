const fs = require('fs');
const path = require('path');

const TRACKER_DIR = path.join(process.cwd(), '.tracker');
const META_FILE = path.join(TRACKER_DIR, 'meta.json');

function getDefaultBookmark() {
  return {
    last_processed_line: 0,
    last_imported_timestamp: 0
  };
}

function readBookmark() {
  if (!fs.existsSync(META_FILE)) {
    return getDefaultBookmark();
  }

  const fileContent = fs.readFileSync(META_FILE, 'utf-8');
  const parsed = JSON.parse(fileContent);
  return { ...getDefaultBookmark(), ...parsed };
}

function writeBookmark(data) {
  if (!fs.existsSync(TRACKER_DIR)) {
    fs.mkdirSync(TRACKER_DIR, { recursive: true });
  }

  fs.writeFileSync(META_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  getDefaultBookmark,
  readBookmark,
  writeBookmark
};
