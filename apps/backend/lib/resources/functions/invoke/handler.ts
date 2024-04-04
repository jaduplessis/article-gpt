import { getEnvVariable, getRegion } from "@article-gpt/helpers";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { InvokePayload, InvokeS3Body } from "../utils";

const s3 = new S3Client({
  region: getRegion(),
});

export const handler = async (event: InvokePayload) => {
  const { connectionId, sourceFunction, modelProps } = event;

  const resp = `
  Received event with id: ${connectionId} from function: ${sourceFunction} 
  
  with modelProps: ${JSON.stringify(modelProps)}`;

  // const response = await invoke(modelProps);

  const body: InvokeS3Body = {
    connectionId,
    systemPrompt: modelProps.systemPrompt,
    humanPrompt: modelProps.humanPrompt,
    invokeResponse: resp,
  };

  const params = {
    Bucket: getEnvVariable("RESULTS_BUCKET_NAME"),
    Key: `${connectionId}/${Date.now()}.json`,
    Body: JSON.stringify(body),
  };

  await s3.send(new PutObjectCommand(params));
};
