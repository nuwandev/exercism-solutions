export function isValid(isbn: string) {
  isbn = isbn.replace(/-/g, '');

  if (isbn.length !== 10) return false; 

  if (!/\d|X/.test(isbn.charAt(isbn.length-1))) return false;

  let sum = 0;
  for (let i = 0; i < isbn.length; i++) {
    let d = Number(isbn.charAt(i));
    if (i == isbn.length - 1 && isbn.charAt(i) === 'X') d = 10;
    
    console.log(d , ' * ', isbn.length - (i), ' = ', d * isbn.length - (i));
    sum += d * (isbn.length - (i));
  }

  console.log(sum, sum % 11 == 0);
  return  sum % 11 == 0;
}
