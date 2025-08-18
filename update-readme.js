// update-readme.js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const repoRoot = __dirname;
const solutionsRoot = path.join(repoRoot, "solutions");
const readmePath = path.join(repoRoot, "README.md");

// Preferred extensions order when linking a file
const preferredExts = [".js", ".ts", ".py", ".go", ".java", ".rb", ".cpp", ".c"];

// Safe readdir
function readdirSafe(p) {
  try {
    return fs.readdirSync(p);
  } catch (e) {
    return [];
  }
}

// Get last git commit time (seconds since epoch) for a path.
// Returns milliseconds (Number). If git fails, returns 0.
function getGitTime(p) {
  try {
    // Use git log -1 --format=%ct to get unix timestamp (seconds)
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

// Find a representative file inside exercise dir (prefers iteration folder then preferred exts)
function findBestFile(exerciseDir) {
  const entries = readdirSafe(exerciseDir);
  const iterationDirs = entries
    .map((e) => path.join(exerciseDir, e))
    .filter((p) => fs.existsSync(p) && fs.statSync(p).isDirectory());

  function pickFromDir(dir) {
    const files = readdirSafe(dir)
      .map((f) => ({ name: f, full: path.join(dir, f) }))
      .filter((f) => fs.existsSync(f.full) && fs.statSync(f.full).isFile());
    for (const ext of preferredExts) {
      const found = files.find((fi) => fi.name.toLowerCase().endsWith(ext));
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

// Main
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

    let gitTime = 0;
    let relativeLink = null;

    if (bestFile) {
      gitTime = getGitTime(bestFile) || getGitTime(exerciseDir) || fs.statSync(bestFile).mtimeMs || 0;
      totalFiles++;
      relativeLink = path.relative(repoRoot, bestFile).replace(/\\/g, "/");
    } else {
      // fallback: link to the folder
      relativeLink = path.relative(repoRoot, exerciseDir).replace(/\\/g, "/");
      gitTime = getGitTime(exerciseDir) || (fs.existsSync(exerciseDir) ? fs.statSync(exerciseDir).mtimeMs : 0);
    }

    // If no git time found (uncommitted?), fall back to filesystem mtime if available
    if (!gitTime) {
      try {
        const stat = fs.existsSync(bestFile || exerciseDir) ? fs.statSync(bestFile || exerciseDir) : null;
        if (stat) gitTime = stat.mtimeMs || stat.ctimeMs || 0;
      } catch (e) {
        gitTime = 0;
      }
    }

    exerciseItems.push({
      name: ex,
      link: `./${relativeLink}`,
      mtime: gitTime,
    });
  }

  // Sort newest first by git time (desc). If equal, sort alphabetically.
  exerciseItems.sort((a, b) => {
    if (b.mtime !== a.mtime) return b.mtime - a.mtime;
    return a.name.localeCompare(b.name);
  });

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
      exercisesMd += `- [${item.name}](${item.link})\n`;
    }
    exercisesMd += "\n";
  }
}
exercisesMd += "<!-- EXERCISES_END -->";

// Read README (or create minimal)
let readme = "";
try {
  readme = fs.readFileSync(readmePath, "utf8");
} catch (e) {
  readme = "# Exercism Solutions\n\n<!-- STATS_START -->\n<!-- STATS_END -->\n\n<!-- EXERCISES_START -->\n<!-- EXERCISES_END -->\n";
}

// Replace or insert STATS block
if (/<!-- STATS_START -->[\s\S]*?<!-- STATS_END -->/.test(readme)) {
  readme = readme.replace(/<!-- STATS_START -->[\s\S]*?<!-- STATS_END -->/, statsMd);
} else {
  readme = statsMd + "\n\n" + readme;
}

// Replace or insert EXERCISES block
if (/<!-- EXERCISES_START -->[\s\S]*?<!-- EXERCISES_END -->/.test(readme)) {
  readme = readme.replace(/<!-- EXERCISES_START -->[\s\S]*?<!-- EXERCISES_END -->/, exercisesMd);
} else {
  readme = readme + "\n\n" + exercisesMd;
}

// Write README only if different
const current = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, "utf8") : "";
if (current !== readme) {
  fs.writeFileSync(readmePath, readme, "utf8");
  console.log("✅ README updated with exercises list and stats!");
} else {
  console.log("✅ README already up-to-date — no changes written.");
}
