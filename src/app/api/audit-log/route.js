export let auditLog = [];

export async function GET() {
  return Response.json(auditLog);
}

export async function POST(request) {
  const body = await request.json();
  auditLog.push({ ...body, timestamp: new Date().toISOString() });
  return Response.json({ success: true });
}