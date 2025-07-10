export let listings = [
  { id: '1', title: 'Toyota Camry 2022', status: 'pending' },
  { id: '2', title: 'Honda Accord 2020', status: 'approved' },
  { id: '3', title: 'Chevrolet Camaro 2018', status: 'rejected' },
  { id: '4', title: 'Tesla Model 3 2021', status: 'rejected' },
  { id: '5', title: 'BMW X5 2019', status: 'rejected' },
  { id: '6', title: 'Nissan Altima 2023', status: 'rejected' },
  { id: '7', title: 'Audi Q7 2020', status: 'rejected' },
  { id: '8', title: 'Hyundai Tucson 2022', status: 'pending' },
  { id: '9', title: 'Mercedes C-Class 2021', status: 'approved' },
  { id: '10', title: 'Volkswagen Tiguan 2020', status: 'pending' }
];

export async function GET() {
  return Response.json(listings);
}