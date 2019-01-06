import * as AWS from 'aws-sdk'; // tslint:disable-line

export default function initS3(
  awsRegion: string,
  awsAccessKeyID: string,
  awsSecretAccessKey: string,
  awsBucket: string,
) {
  AWS.config.update({
    region: awsRegion,
    credentials: new AWS.Credentials(awsAccessKeyID, awsSecretAccessKey),
  });
  const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: awsBucket },
  });
  return {
    download: (url: string, filename: string): Promise<any> =>
      // it's an upload, not a download! WHAT A WORLD!
      fetch(url)
        .then(res => res.blob())
        .then(body =>
          s3.putObject({ Body: body, Bucket: awsBucket, Key: filename }).promise()),

    getAbsolutePath: (filename: string): Promise<string> =>
      s3.headObject({ Bucket: awsBucket, Key: filename })
        .promise()
        .then(() => `s3://${awsBucket}/${filename}`)
        .catch(() => ''),

    deleteDownload: (filename: string): Promise<boolean> =>
      s3.deleteObject({ Bucket: awsBucket, Key: filename })
        .promise()
        .then(() => true),
  };
}

// asd
