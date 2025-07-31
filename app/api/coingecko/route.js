// For App Router users (Next.js 13+)
export async function GET() {
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=idr,cny', {
    headers: {
      'x-cg-demo-api-key': process.env.COINGECKO_API_KEY
    }
  });
  console.log('API KEY:', process.env.COINGECKO_API_KEY);

  const data = await res.json();
  return Response.json(data);
}
