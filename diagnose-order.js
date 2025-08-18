// diagnose-order.js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const repoRoot = __dirname;
const solutionsRoot = path.join(repoRoot, "solutions");

function readdirSafe(p){ try{ return fs.readdirSync(p);}catch{return [];} }

function gitTs(p) {
  try {
    const out = execSync(`git log -1 --format=%ct -- "${p}"`, { encoding: "utf8' , stdio: ['pipe','pipe','ignore'] });
    const s = String(out).trim();
    return s ? parseInt(s, 10) * 1000 : 0;
  } catch { return 0; }
}

const langs = readdirSafe(solutionsRoot).filter(l => fs.statSync(path.join(solutionsRoot, l)).isDirectory());

for (const lang of langs) {
  console.log(`\n== ${lang} ==`);
  const langDir = path.join(solutionsRoot, lang);
  const exercises = readdirSafe(langDir).filter(ex => fs.statSync(path.join(langDir, ex)).isDirectory());

  const rows = [];
  for (const ex of exercises) {
    const exDir = path.join(langDir, ex);
    const folderGit = gitTs(exDir);
    // find any file mtime
    let fileMtime = 0;
    function collect(dir){
      for (const e of readdirSafe(dir)) {
        const full = path.join(dir, e);
        try {
          const st = fs.statSync(full);
          if (st.isDirectory()) collect(full);
          else if (st.isFile()) fileMtime = Math.max(fileMtime, st.mtimeMs || 0);
        } catch {}
      }
    }
    collect(exDir);
    rows.push({ name: ex, folderGit, fileMtime });
  }

  rows.sort((a,b)=> (b.folderGit||b.fileMtime) - (a.folderGit||a.fileMtime));
  for (const r of rows) {
    console.log(`${r.name.padEnd(30)} | git: ${r.folderGit ? new Date(r.folderGit).toISOString() : "---".padEnd(24)} | mtime: ${r.fileMtime ? new Date(r.fileMtime).toISOString() : "---"}`);
  }
}
