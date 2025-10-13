export function clean(phoneNumber: string): string {
  // Check for invalid characters: letters or punctuation (excluding allowed symbols)
  if (/[a-z]/i.test(phoneNumber)) {
    throw new Error('Letters not permitted');
  }
  if (/[@:!]/.test(phoneNumber)) {
    throw new Error('Punctuations not permitted');
  }

  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');

  // Handle number length
  if (digits.length < 10) {
    throw new Error('Incorrect number of digits');
  }
  if (digits.length > 11) {
    throw new Error('More than 11 digits');
  }
  if (digits.length === 11) {
    if (digits[0] !== '1') {
      throw new Error('11 digits must start with 1');
    }
    // Remove country code
    return validateNumber(digits.slice(1));
  }

  return validateNumber(digits);
}

function validateNumber(num: string): string {
  const areaCode = num.slice(0, 3);
  const exchangeCode = num.slice(3, 6);

  // Area code validation
  if (areaCode[0] === '0') {
    throw new Error('Area code cannot start with zero');
  }
  if (areaCode[0] === '1') {
    throw new Error('Area code cannot start with one');
  }

  // Exchange code validation
  if (exchangeCode[0] === '0') {
    throw new Error('Exchange code cannot start with zero');
  }
  if (exchangeCode[0] === '1') {
    throw new Error('Exchange code cannot start with one');
  }

  return num;
}
