export class SimpleCipher {
  static allKeys = new Set<string>();
  key: string;

  constructor(keyP ?: string) {
    if (keyP) {
      this.key = keyP;
    }else {
      this.key = this.generateKey();
    }
  }

  generateKey() {
    let key = '';
    do {
      for (let i = 0; i < 100; i++) {
        key += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
      }
    } while (SimpleCipher.allKeys.has(key))
    
    SimpleCipher.allKeys.add(key);
    return key;
  }
  
  encode(txt: string):string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let encoded = '';
    for (let i = 0; i < txt.length; i++) {
      let textIndex = alphabet.indexOf(txt[i]);
      let shift = alphabet.indexOf(this.key[i % this.key.length]);
      encoded += alphabet[(textIndex + shift) % 26]
    }
    return encoded;
  }

  decode(txt: string):string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let decoded='';
    for (let i = 0; i < txt.length; i++) {
      let textIndex = alphabet.indexOf(txt[i]);
      let shift = alphabet.indexOf(this.key[i % this.key.length]);
      decoded += alphabet[(textIndex - shift + 26) % 26]
    }
    return decoded;
  }
}
