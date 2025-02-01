import dynamic from 'next/dynamic';
import React, { useState } from "react";
import Modal from "./modal";
const ArimaChart = dynamic(() => import('@/components/charts/arimacharts'), { ssr: false });

interface Store {
  id: number;
  name: string;
  data: { date: string; value: number }[];
}

const stores: Store[] = [
  {
    id: 1,
    name: "Store A",
    data: [
      { date: "2023-01-01", value: 100 },
      { date: "2023-02-01", value: 110 },
      { date: "2023-03-01", value: 105 },
    ],
  },
  {
    id: 2,
    name: "Store B",
    data: [
      { date: "2023-01-01", value: 150 },
      { date: "2023-02-01", value: 160 },
      { date: "2023-03-01", value: 170 },
    ],
  },
  {
    id: 3,
    name: "Store c",
    data: [
      { date: "2023-01-01", value: 150 },
      { date: "2023-02-01", value: 160 },
      { date: "2023-03-01", value: 170 },
    ],
  },
];

const Stores: React.FC = () => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Stores</h1>
      <div className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        {stores.map((store, index) => (
          <button
            key={store.id}
            className={`w-full px-4 py-2 font-medium text-left rtl:text-right border-b border-gray-200 cursor-pointer focus:outline-none dark:border-gray-600 `}
          
            onClick={() => setSelectedStore(store)}
          >
            <div className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">{store.name}</span>
                
                <span className=" font-semibold">
                Expected Revenue:&nbsp;
                <span className='text-green-600'>₹{store.data[store.data.length - 1]?.value.toLocaleString("en-IN")}</span>
                  
                </span>
            </div>
            
          </button>
        ))}
      </div>

      <Modal isOpen={!!selectedStore} onClose={() => setSelectedStore(null)}>
        {selectedStore && (
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">{selectedStore.name}</h2>
            <ArimaChart data={selectedStore.data} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Stores;