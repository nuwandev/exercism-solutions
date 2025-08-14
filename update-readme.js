const fs = require("fs");
const path = require("path");

const repoRoot = __dirname;
const solutionsRoot = path.join(repoRoot, "solutions");
const readmePath = path.join(repoRoot, "README.md");

// Preferred extensions order when linking a file
const preferredExts = [".js", ".ts", ".py", ".go", ".java", ".rb", ".cpp", ".c"];

// Utility: safe readdir
function readdirSafe(p) {
  try {
    return fs.readdirSync(p);
  } catch (e) {
    return [];
  }
}

// Find the best file inside a given directory (search nested iteration folders)
function findBestFile(exerciseDir) {
  // list iteration folders (like "1", "2") or files directly
  const entries = readdirSafe(exerciseDir);
  // If the exerciseDir already contains files, consider them too.
  // First search through iteration-folders if present:
  const iterationDirs = entries
    .map((e) => path.join(exerciseDir, e))
    .filter((p) => fs.existsSync(p) && fs.statSync(p).isDirectory());

  // method to pick the best file from a directory
  function pickFromDir(dir) {
    const files = readdirSafe(dir)
      .map((f) => ({ name: f, full: path.join(dir, f) }))
      .filter((f) => fs.existsSync(f.full) && fs.statSync(f.full).isFile());
    // prefer by extension order
    for (const ext of preferredExts) {
      const found = files.find((fi) => fi.name.toLowerCase().endsWith(ext));
      if (found) return found.full;
    }
    // fallback to any file
    if (files.length) return files[0].full;
    return null;
  }

  // search iteration dirs in numeric order (1,2...) but we'll use mtime later
  for (const d of iterationDirs) {
    const file = pickFromDir(d);
    if (file) return file;
  }
  // fallback: pick any file in the exercise directory
  const fallback = pickFromDir(exerciseDir);
  return fallback;
}

// Main scan
const languages = readdirSafe(solutionsRoot).filter((lang) =>
  fs.statSync(path.join(solutionsRoot, lang)).isDirectory()
);

let totalFiles = 0;
let totalExercises = 0;
const langSummaries = [];

for (const lang of languages) {
  const langDir = path.join(solutionsRoot, lang);
  const exercises = readdirSafe(langDir).filter((ex) =>
    fs.statSync(path.join(langDir, ex)).isDirectory()
  );

  const exerciseItems = [];

  for (const ex of exercises) {
    const exerciseDir = path.join(langDir, ex);
    const bestFile = findBestFile(exerciseDir); // absolute path or null
    let mtime = 0;
    let relativeLink = null;

    if (bestFile) {
      const stats = fs.statSync(bestFile);
      mtime = stats.mtimeMs || stats.ctimeMs || Date.now();
      totalFiles++;
      // create a relative link path for markdown
      relativeLink = path.relative(repoRoot, bestFile).replace(/\\/g, "/");
    } else {
      // If no file found, link to the exercise folder
      relativeLink = path.relative(repoRoot, exerciseDir).replace(/\\/g, "/");
      try {
        const stats = fs.statSync(exerciseDir);
        mtime = stats.mtimeMs || stats.ctimeMs || Date.now();
      } catch {
        mtime = Date.now();
      }
    }

    exerciseItems.push({
      name: ex,
      link: `./${relativeLink}`,
      mtime,
    });
  }

  // sort exerciseItems newest first
  exerciseItems.sort((a, b) => b.mtime - a.mtime);

  langSummaries.push({
    language: lang,
    exercises: exerciseItems,
    count: exerciseItems.length,
  });

  totalExercises += exerciseItems.length;
}

// Build stats block markdown
const langListLine = langSummaries.map((s) => `${s.language} (${s.count})`).join(", ") || "—";
const statsMd = `<!-- STATS_START -->
- ✅ **Total Exercises:** ${totalExercises}
- 📁 **Total Files Found:** ${totalFiles}
- 🌐 **Languages Solved In:** ${langListLine}
<!-- STATS_END -->`;

// Build exercises list markdown (newest first per language)
let exercisesMd = "<!-- EXERCISES_START -->\n";
for (const s of langSummaries) {
  exercisesMd += `\n### ${s.language}\n\n`;
  if (s.exercises.length === 0) {
    exercisesMd += "_No exercises yet_\n\n";
  } else {
    for (const item of s.exercises) {
      // Markdown link. Link is relative so GitHub will open file view.
      exercisesMd += `- [${item.name}](${item.link})\n`;
    }
    exercisesMd += "\n";
  }
}
exercisesMd += "<!-- EXERCISES_END -->";

// Read README
let readme = "";
try {
  readme = fs.readFileSync(readmePath, "utf8");
} catch (e) {
  console.error("README.md not found at repo root. Creating a minimal README.md.");
  readme = "# Exercism Solutions\n\n<!-- STATS_START -->\n<!-- STATS_END -->\n\n<!-- EXERCISES_START -->\n<!-- EXERCISES_END -->\n";
}

// Replace STATS block
if (/<!-- STATS_START -->[\s\S]*?<!-- STATS_END -->/.test(readme)) {
  readme = readme.replace(/<!-- STATS_START -->[\s\S]*?<!-- STATS_END -->/, statsMd);
} else {
  // if not present, insert after top
  readme = statsMd + "\n\n" + readme;
}

// Replace EXERCISES block
if (/<!-- EXERCISES_START -->[\s\S]*?<!-- EXERCISES_END -->/.test(readme)) {
  readme = readme.replace(/<!-- EXERCISES_START -->[\s\S]*?<!-- EXERCISES_END -->/, exercisesMd);
} else {
  // append at end
  readme = readme + "\n\n" + exercisesMd;
}

// Write README
fs.writeFileSync(readmePath, readme, "utf8");
console.log("✅ README updated with exercises list and stats!");
