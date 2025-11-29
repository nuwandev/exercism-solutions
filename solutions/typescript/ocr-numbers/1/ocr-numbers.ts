const DIGITS: Record<string, string> = {
  ' _ | ||_|': '0',
  '     |  |': '1',
  ' _  _||_ ': '2',
  ' _  _| _|': '3',
  '   |_|  |': '4',
  ' _ |_  _|': '5',
  ' _ |_ |_|': '6',
  ' _   |  |': '7',
  ' _ |_||_|': '8',
  ' _ |_| _|': '9'
};

export function convert(input: string): string {
  const lines = input.split('\n');
  const result: string[] = [];

  for (let row = 0; row < lines.length; row += 4) {
    const lineDigits: string[] = [];
    const width = lines[row].length;

    for (let col = 0; col < width; col += 3) {
      const pattern =
        (lines[row]?.slice(col, col + 3) ?? '') +
        (lines[row + 1]?.slice(col, col + 3) ?? '') +
        (lines[row + 2]?.slice(col, col + 3) ?? '');
      
      lineDigits.push(DIGITS[pattern] ?? '?');
    }

    result.push(lineDigits.join(''));
  }

  return result.join(',');
}
