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
  
  return spellAbove1000(n)
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

const spellAbove1000 = (n: number): string => {
  const [p1, p2, p3, p4] = n.toString().padStart(12, '0').match(/\d{1,3}/g)!.map(Number);
  let isCalculationStarted = false;
  
  let result = '';
  if (p1 !== 0) {
    if (p1 < 100) {
      result += spellBelow100(p1);
    }else {
      result += spellBelow1000(p1);
    }
    result += ' ' + scales[3];
    isCalculationStarted = true;
  }
  
  if (p2 !== 0) {
    if (isCalculationStarted) result += ' ';
    if (p2 < 100) {
      result += spellBelow100(p2);
    }else {
      result += spellBelow1000(p2);
    }
    result += ' ' + scales[2];
    isCalculationStarted = true;
  }
  
  if (p3 !== 0) {
    if (isCalculationStarted) result += ' ';
    if (p3 < 100) {
      result += spellBelow100(p3);
    }else {
      result += spellBelow1000(p3);
    }
    result += ' ' + scales[1];
    isCalculationStarted = true;
  }
  
  if (p4 !== 0) {
    if (isCalculationStarted) result += ' ';
    if (p4 < 100) {
      result += spellBelow100(p4);
    }else {
      result += spellBelow1000(p4);
    }
  }

  return result;
}