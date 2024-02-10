import { expect, test } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

const testCases = [
  { language: 'es_MX', expectedLocation: 'http://localhost:3000/es' },
  { language: 'en_US', expectedLocation: 'http://localhost:3000/en' },
];

const runTest = async (language: string, expectedLocation: string) => {
  // Arrange
  const req = new NextRequest(new Request('http://localhost:3000'), {});
  req.headers.set('accept-language', language);

  // Act
  const res = await middleware(req);

  // Assert
  expect(res?.headers.get('location')).toEqual(expectedLocation);
};

for (const testCase of testCases) {
  test(`Middleware - ${testCase.language}`, async () => {
    await runTest(testCase.language, testCase.expectedLocation);
  });
}
