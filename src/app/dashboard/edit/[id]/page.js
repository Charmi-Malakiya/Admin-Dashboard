import EditCar from './EditCar';

export default async function EditPage({ params }) {
  const car = await getListing(params.id);
  if (!car) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    };
  }
  return <EditCar initialCar={car} />;
}

async function getListing(id) {
  const res = await fetch('http://localhost:3000/api/listings', { cache: 'no-store' });
  const listings = await res.json();
  return listings.find(item => item.id === id) || null;
}

export async function generateMetadata({ params }) {
  return {
    title: `Edit Car Listing ${params.id}`,
    description: 'Edit a car rental listing'
  };
}