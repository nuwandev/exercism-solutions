const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const repoRoot = __dirname;
const solutionsRoot = path.join(repoRoot, "solutions");
const readmePath = path.join(repoRoot, "README.md");

// Preferred extensions for picking files
const preferredExts = [".ts", ".js", ".py", ".go", ".java", ".rb", ".cpp", ".c"];

// Put languages you want prioritized here (types first)
const languagePriority = ["typescript", "javascript"];

// Safe readdir
function readdirSafe(p) {
  try { return fs.readdirSync(p); } catch { return []; }
}

// Run git log for a path and return commit unix timestamp (ms). 0 if none.
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

// Recursively collect all files under dir
function collectFiles(dir) {
  const result = [];
  for (const ent of readdirSafe(dir)) {
    const full = path.join(dir, ent);
    try {
      const st = fs.statSync(full);
      if (st.isDirectory()) result.push(...collectFiles(full));
      else if (st.isFile()) result.push(full);
    } catch (e) {}
  }
  return result;
}

// Choose newest file inside exercise (by git timestamp primarily, fallback to mtime)
function newestFileInExercise(exerciseDir) {
  const files = collectFiles(exerciseDir);
  if (!files.length) return null;

  // For each file get git timestamp (or 0)
  let best = null;
  let bestT = 0;
  for (const f of files) {
    const t = gitTimestampForPath(f) || 0;
    if (t > bestT) {
      bestT = t;
      best = f;
    }
  }

  // If none had git ts, fallback to mtime
  if (!best) {
    for (const f of files) {
      try {
        const st = fs.statSync(f);
        const t = st.mtimeMs || 0;
        if (t > bestT) {
          bestT = t;
          best = f;
        }
      } catch (e) {}
    }
  }

  return best;
}

// Count code lines in a file (remove comments and blank lines). Attempts to handle common langs.
function countCodeLines(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    const ext = path.extname(filePath).toLowerCase();

    // Remove block comments like /* ... */ (JS/TS/Java/C/C++)
    content = content.replace(/\/\*[\s\S]*?\*\//g, "");

    // Remove triple-quoted strings used like block comments in Python ('''...''' or """...""")
    content = content.replace(/('{3}[\s\S]*?'{3})|("{3}[\s\S]*?"{3})/g, "");

    // Remove single-line comments based on language
    if ([".js", ".ts", ".java", ".cpp", ".c", ".go"].includes(ext)) {
      // remove // comments (naive)
      content = content.replace(/\/\/.*$/gm, "");
    } else if ([".py", ".rb"].includes(ext)) {
      // remove # comments
      content = content.replace(/#.*$/gm, "");
    } else {
      // generic attempt to remove // style and # style
      content = content.replace(/\/\/.*$/gm, "");
      content = content.replace(/#.*$/gm, "");
    }

    // Split and count non-empty lines
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

// reorder languages so priorities come first, then rest alphabetically
const otherLangs = languages.filter(l => !languagePriority.includes(l)).sort();
const orderedLanguages = [
  ...languagePriority.filter(p => languages.includes(p)),
  ...otherLangs
];

let totalFiles = 0;
let totalExercises = 0;
let totalLinesAll = 0;
const langSummaries = [];

for (const lang of orderedLanguages) {
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
  let langFiles = 0;

  for (const ex of exercises) {
    const exerciseDir = path.join(langDir, ex);

    // gather all files inside exercise (only count preferred extensions)
    const allFiles = collectFiles(exerciseDir).filter(f =>
      preferredExts.includes(path.extname(f).toLowerCase())
    );

    // Count all files' lines for language totals
    for (const f of allFiles) {
      langLines += countCodeLines(f);
      langFiles++;
    }

    // Determine newest file to link to (newest of allFiles; if none fallback to any file)
    let linkTarget = null;
    let linkTime = 0;
    if (allFiles.length) {
      for (const f of allFiles) {
        const t = gitTimestampForPath(f) || 0;
        if (t > linkTime) {
          linkTime = t;
          linkTarget = f;
        }
      }
      // fallback to mtimes if git gave nothing
      if (!linkTime) {
        for (const f of allFiles) {
          try {
            const st = fs.statSync(f);
            const t = st.mtimeMs || 0;
            if (t > linkTime) {
              linkTime = t;
              linkTarget = f;
            }
          } catch (e) {}
        }
      }
    } else {
      // if no preferred ext files, still try to pick any file inside
      const anyFiles = collectFiles(exerciseDir);
      if (anyFiles.length) {
        linkTarget = newestFileInExercise(exerciseDir);
        linkTime = gitTimestampForPath(linkTarget) || (fs.existsSync(linkTarget) ? fs.statSync(linkTarget).mtimeMs : 0);
      }
    }

    if (linkTarget) totalFiles++; // count an exercise as having a file

    // relative link shown in README
    const relativeLink = linkTarget
      ? `./${path.relative(repoRoot, linkTarget).replace(/\\/g, "/")}`
      : `./${path.relative(repoRoot, exerciseDir).replace(/\\/g, "/")}`;

    exerciseItems.push({
      name: ex,
      link: relativeLink,
      mtime: linkTime || 0,
    });
  }

  // sort exercises newest-first by mtime, then alphabetically
  exerciseItems.sort((a, b) => {
    if (b.mtime !== a.mtime) return b.mtime - a.mtime;
    return a.name.localeCompare(b.name);
  });

  langSummaries.push({
    language: lang,
    exercises: exerciseItems,
    count: exerciseItems.length,
    lines: langLines,
    files: langFiles,
  });

  totalExercises += exerciseItems.length;
  totalLinesAll += langLines;
}

// Build language list line like: "typescript (14 ex, 181 lines), javascript (30 ex, 832 lines)"
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

// Build exercises block (languages appear in orderedLanguages sequence)
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

// Read README or create template if missing
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
