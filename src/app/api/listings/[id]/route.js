import { listings } from '../route';

export async function PATCH(request, { params }) {
  const { id } = params;
  const body = await request.json();
  const listing = listings.find(item => item.id === id);
  if (!listing) return new Response('Not found', { status: 404 });

  if (body.action === 'approved' || body.action === 'rejected') {
    listing.status = body.action;
    listing.updatedBy = body.admin;
    listing.updatedAt = body.timestamp;
  } else if (body.title) {
    listing.title = body.title;
  }

  return Response.json(listing);
}
