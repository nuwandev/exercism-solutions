const ones = [
  "zero", "one", "two", "three", "four", "five", "six",
  "seven", "eight", "nine", "ten", "eleven", "twelve",
  "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen"
];

const tens = [
  "", "", "twenty", "thirty", "forty", "fifty",
  "sixty", "seventy", "eighty", "ninety"
];

const scales = [
  "hundred", "thousand", "million", "billion"
];

export function sayInEnglish(n: number) {
  if (n < 0 || n >= 1000000000000) {
    throw new Error('Number must be between 0 and 999,999,999,999.');
  }
  if (n < 100) {
    return spellBelow100(n)
  }
  if (n < 1000) {
    return spellBelow1000(n)
  }
  
  return spellLargeNumber(n)
}

const spellBelow100 = (n: number): string => {
  if (n < 20) {
    return ones[n];
  }
  
  const [d1, d2] = n.toString().split('').map(n => Number(n));
  let result = tens[d1];

  if (d2 !== 0) {
    result += '-' + ones[d2];
  }

  return result;
} 

const spellBelow1000 = (n: number): string => {
  const [d1, ...rest] = n.toString().split('').map(n => Number(n));
  let restNum = Number(rest.join(''))

  let result = `${ones[d1]} ${scales[0]}`;

  if (restNum !== 0) {
    result += ` ${spellBelow100(restNum)}`;
  }

  return result;
}

const spellLargeNumber = (n: number): string => {
  const chunks = n.toString().padStart(12, '0').match(/\d{1,3}/g)!.map(Number);
  let result = '';
  let isCalculationStarted = false;
  
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i] !== 0) {
      if (isCalculationStarted) result += ' ';
      if (chunks[i] < 100) {
        result += spellBelow100(chunks[i]);
      }else {
        result += spellBelow1000(chunks[i]);
      }

      if (i !== chunks.length - 1) {
        result += ' ' + scales[chunks.length - 1 - i];
      }
      isCalculationStarted = true;
    }
  }

  return result;
}