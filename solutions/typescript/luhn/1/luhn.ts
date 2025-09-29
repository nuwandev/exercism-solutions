export function valid(digitString: string): boolean {
  if(digitString.trim().length <= 1) return false;

  for (let c of digitString) {
    if (!/\d+|\s/.test(c)) return false;
  }
  
  let digitArr = digitString.split('').filter(c=>c!==' ').reverse().map(d => Number(d));;

  for (let i = 0; i < digitArr.length; i++) {
    if (i % 2 === 1) {
      let value = digitArr[i] * 2;
      if (value > 9) {
        value -= 9
      }
      digitArr[i] = value;
    }
  }
  
  const sum = digitArr.reduce((acc, current) => acc + current, 0)
  
  if (sum % 10 === 0) {
    return true;
  }
  return false;
}
