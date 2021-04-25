import moment from "moment";

export class UtilsService {

    public generateCode(to: string, subject: string, content: string) {

    }
}

export function getRndInteger(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  
export function getExpireDate(time:any, timeS:any) {
    time = time || 30; timeS = timeS || 'minutes';
    let expire = moment().add(time, timeS).unix();
  
    return expire;
}

export class CodConfirmationType {

  constructor() {
    this.code = getRndInteger(1000, 9999).toString();
    this.expire = getExpireDate(10, 'minutes');
  }

  expire: number;

  code: string;
}