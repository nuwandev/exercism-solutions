export function toRna(dna: string) {
  const strand: Record<string, string> = { G: 'C', C: 'G', T: 'A', A: 'U' };
  let rna = "";
  for (let i = 0; i < dna.length; i++) {
    if (!(dna.charAt(i) in strand)) {
      throw new Error("Invalid input DNA.");
    }
    rna = rna + strand[dna.charAt(i)]
  }
  return rna;
}
