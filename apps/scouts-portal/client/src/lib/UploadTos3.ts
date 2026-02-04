import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadToS3 = async (file: File) => {
  // Convert file to buffer if it's not already
const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: `${Date.now().toString()}_${file.name}`,
    Body: buffer,
    ContentType: file.type,
  };

  try {
    const upload = new Upload({
      client: s3Client,
      params,
    });

    const data = await upload.done(); // Upload the file
    return data;
  } catch (error: any) {
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};
