// Temporary. Delete after production reports v24.22.1 or a later 24.x.
export async function GET() {
  return Response.json({ node: process.version });
}
