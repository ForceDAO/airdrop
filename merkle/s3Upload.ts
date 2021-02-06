require("dotenv").config();
import AWS from "aws-sdk";
const data = require("./data");

const s3 = new AWS.S3({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
});

const bucketName: string = process.env.bucket_name
  ? process.env.bucket_name
  : " ";

export const upload = async (data: any) => {
  for (let i = 0; i < data.length; i++) {
    const params: AWS.S3.Types.PutObjectRequest = {
      Bucket: bucketName.toString(),
      Key: data[i].leaf.address,
      Body: JSON.stringify(data[i]),
      ContentType: "application/json; charset=utf-8",
      // ACL: 'public-read', TODO decide if this needs to go in
    };
    await new Promise((resolve, reject) => {
      s3.upload(params, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data);
      });
    });
  }
};

upload(data);
