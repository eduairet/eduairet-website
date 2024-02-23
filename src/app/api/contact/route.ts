export async function POST(req: Request) {
  console.log('req', req);
  return Response.json({ result: 'Success' });
}
