export function hey(message: string): string {
  if (message.trim() === '') {
    return 'Fine. Be that way!'
  }

  const hasLetters = /[a-zA-Z]/.test(message);
    if (hasLetters && message === message.toUpperCase() && message.trim().endsWith('?')) {
    return "Calm down, I know what I'm doing!"
  }
  
  if (hasLetters && message === message.toUpperCase()) {
    return 'Whoa, chill out!'
  }

  if (message.trim().endsWith('?')) {
    return 'Sure.'
  }

  return 'Whatever.'
}
