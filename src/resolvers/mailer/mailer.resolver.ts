import * as nodemailer from 'nodemailer';

export class GMailService {

    private _transporter: nodemailer.Transporter;

    constructor() {
        this._transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'johanpz9850@gmail.com',
                pass: 'bzalbjcfizqlpcfb'
            }
        }
        );
    }
    
    sendMail(to: string, subject: string, content: string) {
        let options = {
            from: 'from_test@gmail.com',
            to: to,
            subject: subject,
            text: content
        }

        this._transporter.sendMail(
            options, (error: any, info: any) => {
                if (error) {
                    return console.log(`error: ${error}`);
                }
                console.log(`Message Sent ${info.response}`);
            });
    }
}
