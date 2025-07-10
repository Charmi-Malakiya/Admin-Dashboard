import CarAdminDash from './CarAdminDash';

export default async function Dashboard() {
  const cars = await getListings();
  return <CarAdminDash initialCars={cars} />;
}

async function getListings() {
  const res = await fetch('http://localhost:3000/api/listings', { cache: 'no-store' });
  return res.json();
}

export async function generateMetadata() {
  return {
    title: 'Car Rental Dashboard',
    description: 'Manage car rental listings'
  };
}