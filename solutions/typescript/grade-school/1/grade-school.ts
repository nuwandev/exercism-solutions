export class GradeSchool {
  private db: { [grade: number]: string[] } = {}

  roster() {
    let dbCopy: { [grade: number]: string[] } = {}
    for (let grade in this.db) {
      dbCopy[grade] = [...this.db[grade]]
    }
    return dbCopy;
  }

  add(name: string, grade: number) {
    for (let g in this.db){
      if (this.db[g].includes(name)) {
        this.db[g] = this.db[g].filter(n => n !== name);
      }
    }
    
    this.db[grade] = [...(this.db[grade] || []), name].sort();
  }

  grade(grade: number) {
    let names: string[] = [];

    for (let name of this.db[grade] || []) {
      names = [...names, name]
    }

    return names;
  }
}
