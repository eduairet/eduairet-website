import { createHash, createHmac } from 'node:crypto';

export type AwsCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
};

type AwsRequest = {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
  region: string;
  service: string;
  credentials: AwsCredentials;
  date?: Date;
};

const sha256 = (data: string) =>
  createHash('sha256').update(data).digest('hex');

const hmac = (key: string | Buffer, data: string) =>
  createHmac('sha256', key).update(data).digest();

export const awsSigningKey = (
  secretAccessKey: string,
  dateStamp: string,
  region: string,
  service: string
) =>
  hmac(
    hmac(hmac(hmac(`AWS4${secretAccessKey}`, dateStamp), region), service),
    'aws4_request'
  );

// AWS Signature Version 4: https://docs.aws.amazon.com/IAM/latest/UserGuide/create-signed-request.html
export const signAwsRequest = ({
  method,
  url,
  headers = {},
  body = '',
  region,
  service,
  credentials,
  date = new Date(),
}: AwsRequest): Record<string, string> => {
  const { host, pathname, search } = new URL(url);
  if (search) throw new Error('signAwsRequest does not sign query strings');

  const amzDate = date.toISOString().replace(/[-:]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const scope = `${dateStamp}/${region}/${service}/aws4_request`;

  const signed = Object.entries({
    ...headers,
    host,
    'x-amz-date': amzDate,
  })
    .map(([name, value]) => [
      name.toLowerCase(),
      value.trim().replace(/ +/g, ' '),
    ])
    .sort(([a], [b]) => (a < b ? -1 : 1));
  const signedHeaders = signed.map(([name]) => name).join(';');

  const canonicalRequest = [
    method,
    pathname,
    '',
    ...signed.map(([name, value]) => `${name}:${value}`),
    '',
    signedHeaders,
    sha256(body),
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    scope,
    sha256(canonicalRequest),
  ].join('\n');

  const signature = hmac(
    awsSigningKey(credentials.secretAccessKey, dateStamp, region, service),
    stringToSign
  ).toString('hex');

  // fetch sets Host from the URL, so it is signed but not returned.
  return {
    ...headers,
    'x-amz-date': amzDate,
    authorization: `AWS4-HMAC-SHA256 Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
};
