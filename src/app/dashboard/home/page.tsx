"use client";
import DropdownMenu from '@/components/charts/Dropdown';
import Stores from '@/components/stores';
import dynamic from 'next/dynamic';

const ArimaChart = dynamic(() => import('@/components/charts/arimacharts'), { ssr: false });

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full flex justify-start p-4">
        <DropdownMenu />
      </div>
      <div className="w-full flex justify-center p-4">
        <Stores />
      </div>
    </div>
  );
};

export default Home;