export function nth(n: number) {
  if (n <= 0) {
    throw new Error('Prime is not possible')
  }
  
  const primeNumbers: number[] = [];
  let number = 2;
  while (primeNumbers.length !== n) {
    let isPrime = true;
    for (let i = 2; i * i <= number; i++) {
      if (number % i == 0) {
        isPrime = false
      }
    }
    if (isPrime) {
      primeNumbers.push(number)
    }
    number++;
  }
  console.log(primeNumbers);
  return primeNumbers[n-1];
}
