// update-readme.js (fixed)
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const repoRoot = __dirname;
const solutionsRoot = path.join(repoRoot, "solutions");
const readmePath = path.join(repoRoot, "README.md");

const preferredExts = [".js", ".ts", ".py", ".go", ".java", ".rb", ".cpp", ".c"];

function readdirSafe(p) {
  try { return fs.readdirSync(p); } catch { return []; }
}

function gitTimestampForPath(p) {
  // returns milliseconds timestamp (Number) or 0 if no git info
  try {
    // Use git log -1 --format=%ct -- "<path>"
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

function computeExerciseTime(exerciseDir) {
  // 1) try folder-level git time
  let t = gitTimestampForPath(exerciseDir);
  if (t) return t;

  // 2) try all files under the exercise folder and take max git time
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

  // 3) fallback to filesystem mtime on best file then folder
  const bestFile = findBestFile(exerciseDir);
  try {
    if (bestFile && fs.existsSync(bestFile)) return fs.statSync(bestFile).mtimeMs || 0;
    if (fs.existsSync(exerciseDir)) return fs.statSync(exerciseDir).mtimeMs || 0;
  } catch (e) {}
  return 0;
}

// Main
const languages = readdirSafe(solutionsRoot).filter(lang => {
  const p = path.join(solutionsRoot, lang);
  return fs.existsSync(p) && fs.statSync(p).isDirectory();
});

let totalFiles = 0;
let totalExercises = 0;
const langSummaries = [];

for (const lang of languages) {
  const langDir = path.join(solutionsRoot, lang);
  const exercises = readdirSafe(langDir).filter(ex => fs.statSync(path.join(langDir, ex)).isDirectory());

  const exerciseItems = [];
  for (const ex of exercises) {
    const exerciseDir = path.join(langDir, ex);
    const bestFile = findBestFile(exerciseDir);
    if (bestFile) totalFiles++;

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

  langSummaries.push({ language: lang, exercises: exerciseItems, count: exerciseItems.length });
  totalExercises += exerciseItems.length;
}

// Build markdown blocks
const langListLine = langSummaries.map(s => `${s.language} (${s.count})`).join(", ") || "—";
const statsMd = `<!-- STATS_START -->
- ✅ **Total Exercises:** ${totalExercises}
- 📁 **Total Files Found:** ${totalFiles}
- 🌐 **Languages Solved In:** ${langListLine}
<!-- STATS_END -->`;

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

// Update README only if changed
let readme = "";
try { readme = fs.readFileSync(readmePath, "utf8"); } catch {
  readme = "# Exercism Solutions\n\n<!-- STATS_START -->\n<!-- STATS_END -->\n\n<!-- EXERCISES_START -->\n<!-- EXERCISES_END -->\n";
}

if (/<!-- STATS_START -->[\s\S]*?<!-- STATS_END -->/.test(readme))
  readme = readme.replace(/<!-- STATS_START -->[\s\S]*?<!-- STATS_END -->/, statsMd);
else
  readme = statsMd + "\n\n" + readme;

if (/<!-- EXERCISES_START -->[\s\S]*?<!-- EXERCISES_END -->/.test(readme))
  readme = readme.replace(/<!-- EXERCISES_START -->[\s\S]*?<!-- EXERCISES_END -->/, exercisesMd);
else
  readme = readme + "\n\n" + exercisesMd;

const current = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, "utf8") : "";
if (current !== readme) {
  fs.writeFileSync(readmePath, readme, "utf8");
  console.log("✅ README updated with exercises list and stats!");
} else {
  console.log("✅ README already up-to-date — no changes written.");
}
