import { connection } from 'next/server';

// Temporary check for the October 2026 Node.js security release.
// Delete this route once production reports v24.22.1 or a later 24.x.
// `connection()` stops prerendering before `process.version` is read, so the
// response is the Function runtime and not the machine that ran `vercel build`.
export const dynamic = 'force-dynamic';

export async function GET() {
  await connection();

  return Response.json(
    { node: process.version, temporary: true },
    {
      headers: {
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex',
      },
    }
  );
}
