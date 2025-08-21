const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const repoRoot = __dirname;
const solutionsRoot = path.join(repoRoot, "solutions");
const readmePath = path.join(repoRoot, "README.md");

const preferredExts = [".js", ".ts", ".py", ".go", ".java", ".rb", ".cpp", ".c"];

// Safe readdir
function readdirSafe(p) {
  try { return fs.readdirSync(p); } catch { return []; }
}

// Get last git commit time (ms) for a path, or 0
function gitTimestampForPath(p) {
  try {
    const out = execSync(`git log -1 --format=%ct -- "${p}"`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();
    if (!out) return 0;
    return parseInt(out, 10) * 1000;
  } catch (e) {
    return 0;
  }
}

// Pick the "best" file in an exercise folder (same logic as before)
function findBestFile(exerciseDir) {
  const entries = readdirSafe(exerciseDir);
  const iterationDirs = entries
    .map(e => path.join(exerciseDir, e))
    .filter(p => fs.existsSync(p) && fs.statSync(p).isDirectory());

  function pickFromDir(dir) {
    const files = readdirSafe(dir)
      .map(f => ({ name: f, full: path.join(dir, f) }))
      .filter(f => fs.existsSync(f.full) && fs.statSync(f.full).isFile());
    for (const ext of preferredExts) {
      const found = files.find(fi => fi.name.toLowerCase().endsWith(ext));
      if (found) return found.full;
    }
    if (files.length) return files[0].full;
    return null;
  }

  for (const d of iterationDirs) {
    const file = pickFromDir(d);
    if (file) return file;
  }
  return pickFromDir(exerciseDir);
}

// Compute mtime by git or fallback to file mtime
function computeExerciseTime(exerciseDir) {
  let t = gitTimestampForPath(exerciseDir);
  if (t) return t;

  const filesList = [];
  function collectFiles(dir) {
    for (const ent of readdirSafe(dir)) {
      const full = path.join(dir, ent);
      try {
        const st = fs.statSync(full);
        if (st.isDirectory()) collectFiles(full);
        else if (st.isFile()) filesList.push(full);
      } catch (e) {}
    }
  }
  collectFiles(exerciseDir);

  let maxT = 0;
  for (const f of filesList) {
    const ft = gitTimestampForPath(f);
    if (ft > maxT) maxT = ft;
  }
  if (maxT) return maxT;

  const bestFile = findBestFile(exerciseDir);
  try {
    if (bestFile && fs.existsSync(bestFile)) return fs.statSync(bestFile).mtimeMs || 0;
    if (fs.existsSync(exerciseDir)) return fs.statSync(exerciseDir).mtimeMs || 0;
  } catch (e) {}
  return 0;
}

// Count code lines in a file (remove block comments and // comments, then count non-empty lines)
function countCodeLines(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Remove block comments /* ... */ (multi-line)
    content = content.replace(/\/\*[\s\S]*?\*\//g, "");

    // Remove line comments //... (naive: removes everything after // on a line)
    // This may remove parts of URLs like http:// but it's fine for typical solution files
    content = content.replace(/\/\/.*$/gm, "");

    // Split lines and count non-empty trimmed lines
    const lines = content.split(/\r?\n/);
    const codeLines = lines.filter(l => l.trim().length > 0).length;
    return codeLines;
  } catch (e) {
    return 0;
  }
}

// --- Main logic ---
const languages = readdirSafe(solutionsRoot).filter(lang => {
  const p = path.join(solutionsRoot, lang);
  return fs.existsSync(p) && fs.statSync(p).isDirectory();
});

let totalFiles = 0;
let totalExercises = 0;
let totalLinesAll = 0;
const langSummaries = [];

for (const lang of languages) {
  const langDir = path.join(solutionsRoot, lang);
  const exercises = readdirSafe(langDir).filter(ex => {
    try {
      return fs.statSync(path.join(langDir, ex)).isDirectory();
    } catch {
      return false;
    }
  });

  const exerciseItems = [];
  let langLines = 0;

  for (const ex of exercises) {
    const exerciseDir = path.join(langDir, ex);
    const bestFile = findBestFile(exerciseDir);
    if (bestFile) totalFiles++;

    // Count lines only for the chosen file (bestFile)
    if (bestFile) {
      langLines += countCodeLines(bestFile);
    }

    const timestamp = computeExerciseTime(exerciseDir) || 0;
    const relativeLink = (bestFile ? path.relative(repoRoot, bestFile) : path.relative(repoRoot, exerciseDir)).replace(/\\/g, "/");

    exerciseItems.push({
      name: ex,
      link: `./${relativeLink}`,
      mtime: timestamp,
    });
  }

  exerciseItems.sort((a, b) => {
    if (b.mtime !== a.mtime) return b.mtime - a.mtime;
    return a.name.localeCompare(b.name);
  });

  langSummaries.push({ language: lang, exercises: exerciseItems, count: exerciseItems.length, lines: langLines });
  totalExercises += exerciseItems.length;
  totalLinesAll += langLines;
}

// Build stats block
const langListLine = langSummaries.length
  ? langSummaries.map(s => `${s.language} (${s.count} ex, ${s.lines} lines)`).join(", ")
  : "—";

function prettyShort(n) {
  if (n >= 1000000) return `${Math.round(n / 1000000)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return `${n}`;
}

const statsMd = `<!-- STATS_START -->
- ✅ **Total Exercises:** ${totalExercises}
- 📁 **Total Files Found:** ${totalFiles}
- 🌐 **Languages Solved In:** ${langListLine}
- 🧾 **Total Lines of Code (approx):** ${totalLinesAll} (${prettyShort(totalLinesAll)} lines)
<!-- STATS_END -->`;

// Build exercises block
let exercisesMd = "<!-- EXERCISES_START -->\n";
for (const s of langSummaries) {
  exercisesMd += `\n### ${s.language}\n\n`;
  if (!s.exercises.length) exercisesMd += "_No exercises yet_\n\n";
  else {
    for (const item of s.exercises) {
      exercisesMd += `- [${item.name}](${item.link})\n`;
    }
    exercisesMd += "\n";
  }
}
exercisesMd += "<!-- EXERCISES_END -->";

// Update README template and timestamp
let readme = "";
try { readme = fs.readFileSync(readmePath, "utf8"); } catch {
  readme = "# Exercism Solutions\n\n<!-- STATS_START -->\n<!-- STATS_END -->\n\n<!-- EXERCISES_START -->\n<!-- EXERCISES_END -->\n";
}

// Replace stats block
if (/<!-- STATS_START -->[\s\S]*?<!-- STATS_END -->/.test(readme))
  readme = readme.replace(/<!-- STATS_START -->[\s\S]*?<!-- STATS_END -->/, statsMd);
else
  readme = statsMd + "\n\n" + readme;

// Replace exercises block
if (/<!-- EXERCISES_START -->[\s\S]*?<!-- EXERCISES_END -->/.test(readme))
  readme = readme.replace(/<!-- EXERCISES_START -->[\s\S]*?<!-- EXERCISES_END -->/, exercisesMd);
else
  readme = readme + "\n\n" + exercisesMd;

// Update last-updated tag (between <!-- UPDATED_AT --> and <!-- /UPDATED_AT -->)
const nowStr = (() => {
  try {
    // Use user's timezone (Asia/Colombo) if possible for readable timestamp
    return new Date().toLocaleString("en-GB", { timeZone: "Asia/Colombo" });
  } catch {
    return new Date().toISOString();
  }
})();
const updatedAtMd = `<!-- UPDATED_AT -->
_Last updated: ${nowStr} (Asia/Colombo)_
<!-- /UPDATED_AT -->`;

if (/<!-- UPDATED_AT -->[\s\S]*?<!-- \/UPDATED_AT -->/.test(readme))
  readme = readme.replace(/<!-- UPDATED_AT -->[\s\S]*?<!-- \/UPDATED_AT -->/, updatedAtMd);
else
  readme = updatedAtMd + "\n\n" + readme;

// Write only if changed
const current = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, "utf8") : "";
if (current !== readme) {
  fs.writeFileSync(readmePath, readme, "utf8");
  console.log("✅ README updated with exercises list, stats, lines count, and timestamp!");
} else {
  console.log("✅ README already up-to-date — no changes written.");
}
