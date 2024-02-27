export async function POST(req: Request) {
  if (req.method !== 'POST') return { status: 405, body: 'Method Not Allowed' };
  const { name, email, message } = await req.json();
  if (!name || !email || !message) return { status: 400, body: 'Bad Request' };
  // TODO Handle Captcha
  return Response.json({ result: 'Success' });
}
