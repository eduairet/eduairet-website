// @vitest-environment node
import { describe, expect, test } from 'vitest';
import { awsSigningKey, signAwsRequest } from '@/utils/server/aws.utils';

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
