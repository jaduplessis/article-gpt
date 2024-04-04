import { S3Event } from "aws-lambda";
import { InvocationEntity } from "../../dataModel/Invocation";

export const handler = async (event: S3Event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const encodedKey = event.Records[0].s3.object.key;

  const key = decodeURIComponent(encodedKey);

  const keyParts = key.split("/");
  const connectionId = keyParts[0];

  await InvocationEntity.update({
    connectionId,
    status: "COMPLETE",
    outputLocation: {
      bucket,
      key,
    },
  });
};
