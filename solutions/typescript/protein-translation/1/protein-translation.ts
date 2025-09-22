const codonsAndAminoAcid: Record<string,string> = {
  'AUG': 'Methionine',
  'UUU': 'Phenylalanine',
  'UUC': 'Phenylalanine',
  'UUA': 'Leucine',
  'UUG': 'Leucine',
  'UCU': 'Serine',
  'UCC': 'Serine',
  'UCA': 'Serine',
  'UCG': 'Serine',
  'UAU': 'Tyrosine',
  'UAC': 'Tyrosine',
  'UGU': 'Cysteine',
  'UGC': 'Cysteine',
  'UGG': 'Tryptophan',
  'UAA': 'STOP',
  'UAG': 'STOP',
  'UGA': 'STOP',
};

export function translate(rna: string): string[] {
  let codonsArr: string[] = [];
  for (let i = 0; i < rna.length; i+=3) {
    codonsArr.push(rna.slice(i, i+3));
  }

  let aminoAcidArr: string[] = [];
  for (let i = 0; i < codonsArr.length; i++) {
    if (!codonsAndAminoAcid.hasOwnProperty(codonsArr[i])) {
      throw new Error('Invalid codon');
    }

    if (codonsAndAminoAcid[codonsArr[i]] === 'STOP') {
      break;
    }
    
    aminoAcidArr.push(codonsAndAminoAcid[codonsArr[i]]);
  }

  return aminoAcidArr
}
