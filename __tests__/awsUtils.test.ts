// @vitest-environment node
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  assumeRoleWithWebIdentity,
  awsSigningKey,
  putDynamoDbItem,
  signAwsRequest,
} from '@/utils/server/aws.utils';

// AWS's published example credentials, not real ones.
const credentials = {
  accessKeyId: 'AKIDEXAMPLE',
  secretAccessKey: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY',
};

const sign = (
  method: string,
  headers: Record<string, string> = {},
  body = ''
) =>
  signAwsRequest({
    method,
    url: 'https://example.amazonaws.com/',
    headers,
    body,
    region: 'us-east-1',
    service: 'service',
    credentials,
    date: new Date('2015-08-30T12:36:00Z'),
  });

// Expected values come from the AWS SigV4 test suite, as shipped in botocore:
// https://github.com/boto/botocore/tree/develop/tests/unit/auth/aws4_testsuite
describe('signAwsRequest matches the AWS SigV4 test suite', () => {
  test('get-vanilla', () => {
    expect(sign('GET')).toEqual({
      'x-amz-date': '20150830T123600Z',
      authorization:
        'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/service/aws4_request, SignedHeaders=host;x-amz-date, Signature=5fa00fa31553b73ebf1942676e86291e8372ff2a2260956d9b8aae1d763fbf31',
    });
  });

  test('post-vanilla', () => {
    expect(sign('POST').authorization).toBe(
      'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/service/aws4_request, SignedHeaders=host;x-amz-date, Signature=5da7c1a2acd57cee7505fc6676e4e544621c30862966e37dddb68e92efbe5d6b'
    );
  });

  test('post-x-www-form-urlencoded hashes the body', () => {
    const headers = sign(
      'POST',
      { 'Content-Type': 'application/x-www-form-urlencoded' },
      'Param1=value1'
    );
    expect(headers['Content-Type']).toBe('application/x-www-form-urlencoded');
    expect(headers.authorization).toBe(
      'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/service/aws4_request, SignedHeaders=content-type;host;x-amz-date, Signature=ff11897932ad3f4e8b18135d722051e5ac45fc38421b1da7b9d196a0fe09473a'
    );
  });

  test('get-header-value-trim', () => {
    expect(
      sign('GET', { 'My-Header1': ' value1', 'My-Header2': ' "a   b   c"' })
        .authorization
    ).toBe(
      'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/service/aws4_request, SignedHeaders=host;my-header1;my-header2;x-amz-date, Signature=acc3ed3afb60bb290fc8d2dd0098b9911fcaa05412b367055dee359757a9c736'
    );
  });

  test('post-sts-header-before signs the session token', () => {
    const sessionToken =
      'AQoDYXdzEPT//////////wEXAMPLEtc764bNrC9SAPBSM22wDOk4x4HIZ8j4FZTwdQWLWsKWHGBuFqwAeMicRXmxfpSPfIeoIYRqTflfKD8YUuwthAx7mSEI/qkPpKPi/kMcGdQrmGdeehM4IC1NtBmUpp2wUE8phUZampKsburEDy0KPkyQDYwT7WZ0wq5VSXDvp75YU9HFvlRd8Tx6q6fE8YQcHNVXAkiY9q6d+xo0rKwT38xVqr7ZD0u0iPPkUL64lIZbqBAz+scqKmlzm8FDrypNC9Yjc8fPOLn9FX9KSYvKTr4rvx3iSIlTJabIQwj2ICCR/oLxBA==';
    const headers = signAwsRequest({
      method: 'POST',
      url: 'https://example.amazonaws.com/',
      region: 'us-east-1',
      service: 'service',
      credentials: { ...credentials, sessionToken },
      date: new Date('2015-08-30T12:36:00Z'),
    });

    expect(headers['x-amz-security-token']).toBe(sessionToken);
    expect(headers.authorization).toBe(
      'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/service/aws4_request, SignedHeaders=host;x-amz-date;x-amz-security-token, Signature=85d96828115b5dc0cfc3bd16ad9e210dd772bbebba041836c64533a82be05ead'
    );
  });
});

// "Examples of How to Derive a Signing Key for Signature Version 4", AWS General Reference:
// https://docs.aws.amazon.com/general/latest/gr/signature-v4-examples.html (archived 2019-12-15)
test('awsSigningKey matches the AWS derived-key example', () => {
  expect(
    awsSigningKey(
      'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY',
      '20120215',
      'us-east-1',
      'iam'
    ).toString('hex')
  ).toBe('f4780e2d9f65fa895f9c67b32ce1baf0b0d8a43505a000a1a9e090d414db404d');
});

test('refuses a URL with a query string', () => {
  expect(() =>
    signAwsRequest({
      method: 'GET',
      url: 'https://example.amazonaws.com/?a=b',
      region: 'us-east-1',
      service: 'service',
      credentials,
    })
  ).toThrow();
});

describe('assumeRoleWithWebIdentity', () => {
  const fetchMock = vi.fn();
  const role = {
    region: 'us-east-1',
    roleArn: 'arn:aws:iam::123456789012:role/example',
    sessionName: 'example-session',
    webIdentityToken: 'oidc-token',
  };

  const stsReplies = (body: string, status = 200) =>
    fetchMock.mockResolvedValueOnce(new Response(body, { status }));

  beforeEach(() => vi.stubGlobal('fetch', fetchMock));

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  test('posts an unsigned form to the regional STS endpoint', async () => {
    stsReplies(
      `<AssumeRoleWithWebIdentityResponse><AssumeRoleWithWebIdentityResult><Credentials>
        <AccessKeyId>ASIAEXAMPLE</AccessKeyId>
        <SecretAccessKey>temporary-secret</SecretAccessKey>
        <SessionToken>session-token</SessionToken>
      </Credentials></AssumeRoleWithWebIdentityResult></AssumeRoleWithWebIdentityResponse>`
    );

    expect(await assumeRoleWithWebIdentity(role)).toEqual({
      accessKeyId: 'ASIAEXAMPLE',
      secretAccessKey: 'temporary-secret',
      sessionToken: 'session-token',
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://sts.us-east-1.amazonaws.com/');
    expect(init.headers).toBeUndefined();
    const params = new URLSearchParams(init.body.toString());
    expect(params.get('Action')).toBe('AssumeRoleWithWebIdentity');
    expect(params.get('RoleArn')).toBe(role.roleArn);
    expect(params.get('RoleSessionName')).toBe(role.sessionName);
    expect(params.get('WebIdentityToken')).toBe(role.webIdentityToken);
  });

  test('a refusal throws only the status and error code', async () => {
    stsReplies(
      `<ErrorResponse><Error><Type>Sender</Type><Code>AccessDenied</Code>
        <Message>Not authorized to perform sts:AssumeRoleWithWebIdentity on ${role.roleArn}</Message>
      </Error></ErrorResponse>`,
      403
    );

    await expect(assumeRoleWithWebIdentity(role)).rejects.toThrow(
      /^403 AccessDenied$/
    );
  });
});

// Request format: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html
describe('putDynamoDbItem', () => {
  const fetchMock = vi.fn();
  const put = {
    region: 'us-east-1',
    tableName: 'example-table',
    item: { id: { S: 'abc' }, expiresAt: { N: '1700000000' } },
    credentials: {
      accessKeyId: 'ASIAEXAMPLE',
      secretAccessKey: 'temporary-secret',
      sessionToken: 'session-token',
    },
  };

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    vi.useFakeTimers({ now: new Date('2026-10-13T12:00:00Z') });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  test('posts a PutItem signed over the exact body it sends', async () => {
    fetchMock.mockResolvedValueOnce(new Response('{}'));
    await putDynamoDbItem(put);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://dynamodb.us-east-1.amazonaws.com/');
    expect(init.method).toBe('POST');
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(JSON.parse(init.body)).toEqual({
      TableName: 'example-table',
      Item: { id: { S: 'abc' }, expiresAt: { N: '1700000000' } },
    });
    expect(init.headers['content-type']).toBe('application/x-amz-json-1.0');
    expect(init.headers['x-amz-target']).toBe('DynamoDB_20120810.PutItem');
    expect(init.headers['x-amz-security-token']).toBe('session-token');
    expect(init.headers.authorization).toContain(
      'Credential=ASIAEXAMPLE/20261013/us-east-1/dynamodb/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target,'
    );
    const { authorization } = signAwsRequest({
      method: 'POST',
      url,
      headers: {
        'content-type': 'application/x-amz-json-1.0',
        'x-amz-target': 'DynamoDB_20120810.PutItem',
      },
      body: init.body,
      region: 'us-east-1',
      service: 'dynamodb',
      credentials: put.credentials,
    });
    expect(init.headers.authorization).toBe(authorization);
  });

  test('a refusal throws only the status and error type', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          __type: 'com.amazonaws.dynamodb.v20120810#ResourceNotFoundException',
          message:
            'Requested resource not found: Table: example-table not found',
        }),
        { status: 400 }
      )
    );

    await expect(putDynamoDbItem(put)).rejects.toThrow(
      /^400 ResourceNotFoundException$/
    );
  });
});
