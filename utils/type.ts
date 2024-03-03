export interface Iuser {
  [key: string]: {
      privateKey: string,
      publicKey: string,
      balance: number,
      referralLink:string,
      referees:string[],
      referrer: string
  }
}