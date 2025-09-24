export function nucleotideCounts(DNA: string) {
  const nucleotides: Record<string, number> = {
      A: 0,
      C: 0,
      G: 0,
      T: 0,
    }
  
  for (let i = 0; i < DNA.length; i++) {
    if (!nucleotides.hasOwnProperty(DNA.charAt(i))) throw new Error('Invalid nucleotide in strand');
    
    nucleotides[DNA.charAt(i)] = Number(nucleotides[DNA.charAt(i)]) + 1;
  }
  
  return nucleotides;
}
