export class Komentar {
  PK: string;
  SK: string;
  vsebina: string;
  upvotes: number;
  avtor: string;
  komentarji: Komentar[];

  constructor(pk: string, sk: string, v: string, u: number, a: string, k: Komentar[]) {
    this.PK = pk;
    this.SK = sk;
    this.vsebina = v;
    this.upvotes = u;
    this.avtor = a;
    this.komentarji = k;
  }
}
