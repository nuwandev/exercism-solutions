const atbashMap: Record<string, string> = {
  a: "z", b: "y", c: "x", d: "w", e: "v",
  f: "u", g: "t", h: "s", i: "r", j: "q",
  k: "p", l: "o", m: "n", n: "m", o: "l",
  p: "k", q: "j", r: "i", s: "h", t: "g",
  u: "f", v: "e", w: "d", x: "c", y: "b",
  z: "a"
};

export function encode(plainText: string): string {
  plainText = plainText.toLowerCase();
  let encodedText: string = '';
  let count = 0;
  for (let i = 0; i < plainText.length; i++) {
    if (plainText.charAt(i) !== ' ') {
      if (/\d/.test(plainText.charAt(i))) {
        encodedText += plainText.charAt(i)
        count ++;
        continue;
      }

      if (plainText.charAt(i) in atbashMap) {
        encodedText += atbashMap[plainText.charAt(i)]
        count ++;
      }

      if (count % 5 === 0 && i!==plainText.length-1) {
        encodedText = encodedText + ' '
      }
    }
  }
  
  return encodedText
}

export function decode(cipherText: string): string {
  let decodedText: string = '';
  for (let i = 0; i < cipherText.length; i++) {
    if (cipherText.charAt(i) !== ' ') {
      if (/\d/.test(cipherText.charAt(i))) {
        decodedText += cipherText.charAt(i)
      }else if (cipherText.charAt(i) in atbashMap) {
        decodedText += atbashMap[cipherText.charAt(i)]
      }
    }
  }
  
  return decodedText
}
