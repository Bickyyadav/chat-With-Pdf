/* eslint-disable @typescript-eslint/no-unused-vars */
import AWS from "aws-sdk";

export async function uploadToS3(file: File) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_AWS_SECRET_ACCESS_KEY,
    });
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region: "ap-south-1",
    });

    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace("", "-");

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: file_key,
      Body: file,
      ContentType: file.type,
    };

    const upload = s3
        .putObject(params)
      .on("httpUploadProgress", (evt) => {
        console.log("🚀 ~ uploadToS3 ~ evt:", evt);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        console.log(
          "🚀 ~ uploadToS3 ~ upload:",
          parseInt(((evt.loaded * 100) / evt.total).toString())
        ) + "%";
      })
      .promise();
    await upload.then((data) => {
      console.log("🚀 ~ await upload.then ~ data:", file_key);
    });
    return Promise.resolve({
      file_key,
      file_name: file.name,
    });
  } catch (error) {
    console.log("🚀 ~ uploadToS3 ~ error:", error);
  }
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`;
  return url;
}
