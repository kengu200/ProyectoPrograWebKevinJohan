import AWS from 'aws-sdk';
import stream from 'stream';

var result = AWS.config.update({
  accessKeyId: 'AKIAZ75VZQWMHHKXL5GL',
  secretAccessKey: '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'
});


const s3bucket = new AWS.S3({
  params: {
    Bucket: 'bolsaempleo'
  }
});

export class awsService {
  constructor() { }
  /**
 * AWS UploadFile
 * @param {string} file base64 file to upload
 * @param {string} location location of the file to upload
 */
  public async uploadFile(file: string, location: string): Promise<any> {
    const data = file;
    const format = data.substring(data.indexOf('data:') + 5, data.indexOf(';base64'));

    return s3bucket.upload({
      Bucket: 'bolsaempleo',
      Key: location,
      Body: file,
      ACL: 'public-read',
      ContentEncoding: 'base64'
    }).promise().then(upload => {
      let url = upload.Key.replace('uploads/', '');

      return upload.Location;

    }).catch(err => {
      return err
    });
  }

  public async uploadDocumentfromMailbox(file: string, location: string): Promise<any> {
    const format = file.substring(file.indexOf('data:') + 5, file.indexOf(';base64'));
    return s3bucket.upload({
      Bucket: 'bolsaempleo',
      Key: location,
      Body: file,
      ACL: 'public-read'
      
    }).promise().then(upload => {
      let url = upload.Key.replace('uploads/', '');
      //console.log(upload);
      return upload.Location;

    }).catch(err => {
      return err
    });
  }

}

export const uploadStream:any = ({ Key }:{Key:any}) => {

  const pass = new stream.PassThrough();
  return {
    writeStream: pass,
    promise: s3bucket.upload({ ACL: 'public-read', Bucket: 'bolsaempleo', Key: Key, Body: pass }).promise(),
  };
}