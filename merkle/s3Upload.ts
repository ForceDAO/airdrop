require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");
const data = require("./data/allProofs.json");

const s3 = new S3({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
});

const bucketName: string = process.env.bucket_name
  ? process.env.bucket_name
  : " ";

export const upload = async (data: any) => {
  for (let i = 0; i < data.length; i++) {
    const params: any = {
      Bucket: bucketName.toString(),
      Key: data[i].leaf.address,
      Body: JSON.stringify(data[i]),
      ContentType: "application/json; charset=utf-8",
      ACL: "public-read",
    };
    await new Promise((resolve, reject) => {
      s3.upload(params, (error, data) => {
        if (error) {
          return reject(error);
        }
        console.log(i, "uploaded");
        return resolve(data);
      });
    });
  }
};

upload(data);
