export class Blog {
  PK: string;
  SK: string;
  naslov: string;
  vsebina: string;
  datum: string;

  constructor(pk: string, sk: string, nsl: string, vs: string, dat: string) {
    this.PK = pk;
    this.SK = sk;
    this.naslov = nsl;
    this.vsebina = vs;
    this.datum = dat;
  }
}
