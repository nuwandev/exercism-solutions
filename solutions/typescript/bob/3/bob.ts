export function hey(message: string): string {
  const trimmed = message.trim();
  const hasLetters = /[a-zA-Z]/.test(trimmed);
  const isYelling = hasLetters && trimmed === trimmed.toUpperCase();
  const isQuestion = trimmed.endsWith('?');
  
  if (trimmed === '') return 'Fine. Be that way!';
  if (isYelling && isQuestion) return "Calm down, I know what I'm doing!";
  if (isYelling) return 'Whoa, chill out!';
  if (isQuestion) return 'Sure.';
  return 'Whatever.';

}
