"use client";
import DropdownMenu from '@/components/charts/Dropdown';
import MapPointsViewer from '@/components/charts/map';
import dynamic from 'next/dynamic';

const ArimaChart = dynamic(() => import('@/components/charts/arimacharts'), { ssr: false });

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full flex justify-start p-4">
        <DropdownMenu />
        
      </div> 
      <div className="flex-grow flex items-center justify-center w-full">
        {/* <ArimaChart /> */}
        
        <MapPointsViewer/>
      </div>
    </div>
  );
};

export default Home;