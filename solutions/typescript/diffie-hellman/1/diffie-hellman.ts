export class DiffieHellman {
  private p: number;
  private g: number;
  
  constructor(p: number, g: number) {
    if (typeof p !== 'number' || !this.isPrime(p) || p <= 2) throw new Error();
    if (typeof g !== 'number' || !this.isPrime(g) || g <= 1) throw new Error();
    
    this.p = p;
    this.g = g;
  }
  
  public getPublicKey(privateKey: number): number {
    if (1 >= privateKey || this.p <= privateKey) throw new Error();

    return Math.pow(this.g, privateKey) % this.p;
  }

  public getSecret(theirPublicKey: number, myPrivateKey: number): number {
    return Math.pow(theirPublicKey, myPrivateKey) % this.p;
  }

  private isPrime(num: number): boolean {
    if (num <= 1) {
        return false;
    }
    if (num === 2) {
        return true;
    }
    if (num % 2 === 0) {
        return false;
    }
    const limit = Math.sqrt(num);
    for (let i = 3; i <= limit; i += 2) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
  }
}
