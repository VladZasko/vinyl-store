import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mime from 'mime-types';
import * as AWS from 'aws-sdk';

@Injectable()
export class StorageService {
  private s3: AWS.S3;
  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      region: 'eu-north-1',
      credentials: {
        accessKeyId: configService.get('aws.key'),
        secretAccessKey: configService.get('aws.secret'),
      },
    });
  }

  async uploadFile(bucketName: string, key: string, file: Buffer) {
    const putObj = {
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: mime.lookup(key),
    };

    try {
      return await this.s3.upload(putObj).promise();
    } catch (e) {
      throw new InternalServerErrorException('ERROR with storage');
    }
  }
}
