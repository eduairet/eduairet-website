import { createHash, createHmac } from 'node:crypto';
import { AwsCredentials } from '@/models';

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

type WebIdentityRole = {
  region: string;
  roleArn: string;
  sessionName: string;
  webIdentityToken: string;
};

const STS_TIMEOUT_MS = 10_000;
const STS_SESSION_SECONDS = '900';

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
  const amzHeaders: Record<string, string> = { 'x-amz-date': amzDate };
  if (credentials.sessionToken)
    amzHeaders['x-amz-security-token'] = credentials.sessionToken;

  const signed = Object.entries({ ...headers, host, ...amzHeaders })
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
    ...amzHeaders,
    authorization: `AWS4-HMAC-SHA256 Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
};

const xmlField = (xml: string, name: string) =>
  xml.match(new RegExp(`<${name}>([^<]+)</${name}>`))?.[1];

// The web identity token is the credential here, so the request is not signed.
export const assumeRoleWithWebIdentity = async ({
  region,
  roleArn,
  sessionName,
  webIdentityToken,
}: WebIdentityRole): Promise<AwsCredentials> => {
  const res = await fetch(`https://sts.${region}.amazonaws.com/`, {
    method: 'POST',
    body: new URLSearchParams({
      Action: 'AssumeRoleWithWebIdentity',
      Version: '2011-06-15',
      RoleArn: roleArn,
      RoleSessionName: sessionName,
      WebIdentityToken: webIdentityToken,
      DurationSeconds: STS_SESSION_SECONDS,
    }),
    signal: AbortSignal.timeout(STS_TIMEOUT_MS),
  });
  const xml = await res.text();
  const accessKeyId = xmlField(xml, 'AccessKeyId');
  const secretAccessKey = xmlField(xml, 'SecretAccessKey');
  const sessionToken = xmlField(xml, 'SessionToken');

  if (!res.ok || !accessKeyId || !secretAccessKey || !sessionToken)
    throw new Error(`${res.status} ${xmlField(xml, 'Code') ?? ''}`.trim());
  return { accessKeyId, secretAccessKey, sessionToken };
};
