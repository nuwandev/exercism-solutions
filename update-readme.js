const fs = require("fs");
const path = require("path");

const solutionsDir = path.join(__dirname, "solutions", "javascript");
let totalExercises = 0;
let totalJsFiles = 0;

const exerciseFolders = fs.readdirSync(solutionsDir).filter((f) => {
  const fullPath = path.join(solutionsDir, f);
  return fs.statSync(fullPath).isDirectory();
});

totalExercises = exerciseFolders.length;

exerciseFolders.forEach((folder) => {
  const exercisePath = path.join(solutionsDir, folder, "1");
  if (fs.existsSync(exercisePath)) {
    const files = fs.readdirSync(exercisePath);
    const jsFiles = files.filter((f) => f.endsWith(".js"));
    totalJsFiles += jsFiles.length;
  }
});

const readmePath = path.join(__dirname, "README.md");
let readme = fs.readFileSync(readmePath, "utf-8");

const statsBlock = `<!-- STATS_START -->
- ✅ **Total JavaScript Exercises Completed:** ${totalExercises}
- 📁 **Total JavaScript Files:** ${totalJsFiles} \`.js\` files
- 🌐 **Languages Solved In:** JavaScript
<!-- STATS_END -->`;

readme = readme.replace(
  /<!-- STATS_START -->[\s\S]*?<!-- STATS_END -->/,
  statsBlock
);

fs.writeFileSync(readmePath, readme);

console.log("✅ README updated with stats!");
