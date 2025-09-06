export class GradeSchool {
  private db = new Map<number, string[]>();
  
  roster() {
    const obj: Record<number, string[]> = {};
  
    for (const [grade, students] of this.db) {
      obj[grade] = [...students];
    }
  
    return obj;
  }

  add(name: string, grade: number) {
    for (let [g, students] of this.db) {
      if (students.includes(name)) {
        this.db.set(g, students.filter((n) => n !== name))
      }
    }

    this.db.set(grade, [...(this.db.get(grade) || []), name].sort())
  }

  grade(grade: number) {
    return [...this.db.get(grade) || []]
  }
}
