export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const year = searchParams.get('year') === 'true';
  const month = searchParams.get('month') === 'true';
  const day = searchParams.get('day') === 'true';

  const currentYear = year && new Date().getFullYear();
  const currentMonth = month && new Date().getMonth() + 1;
  const currentDay = day && new Date().getDate();

  return Response.json({
    year: currentYear,
    month: currentMonth,
    day: currentDay,
  });
}
