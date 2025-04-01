import { Suspense } from 'react';
import AirportViewer from '../components/AirportViewer';

export default function Home() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <AirportViewer />
    </Suspense>
  );
}
