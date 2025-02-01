import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';

interface Point {
  lat: number;
  lng: number;
  name: string;
}

interface NewPoint {
  lat: string;
  lng: string;
  name: string;
}

declare global {
  interface Window {
    L: {
      map: (id: string) => {
        setView: (center: [number, number], zoom: number) => any;
        addLayer: (layer: any) => void;
        eachLayer: (callback: (layer: any) => void) => void;
        removeLayer: (layer: any) => void;
      };
      tileLayer: (url: string, options: { attribution: string }) => {
        addTo: (map: any) => void;
      };
      marker: (position: [number, number], options?: any) => {
        bindPopup: (content: string) => {
          addTo: (map: any) => void;
        };
      };
      Marker: any;
      Icon: new (options: any) => any;
      icon: (options: any) => any;
    };
  }
}

const MapPointsViewer: React.FC = () => {
  // Mumbai coordinates
  const MUMBAI_LAT = 19.0760;
  const MUMBAI_LNG = 72.8777;

  const [points, setPoints] = useState<Point[]>([
    { lat: MUMBAI_LAT, lng: MUMBAI_LNG, name: 'Mumbai' },
    { lat: 40.7128, lng: -74.0060, name: 'New York' },
    { lat: 34.0522, lng: -118.2437, name: 'Los Angeles' },
    { lat: 41.8781, lng: -87.6298, name: 'Chicago' },
    { lat: 48.8566, lng: 2.3522, name: 'Paris' }
  ]);

  const [newPoint, setNewPoint] = useState<NewPoint>({
    lat: '',
    lng: '',
    name: ''
  });
  
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    const style = document.createElement('style');
    // style.textContent = `
    //   .leaflet-default-icon-path {
    //     background-image: url(https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png);
    //   }
    //   .leaflet-marker-icon {
    //     background-image: url(https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png);
    //     background-size: contain;
    //   }
    // `;
    document.head.appendChild(style);

    const loadLeaflet = (): void => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
      script.async = true;
      document.body.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
      document.head.appendChild(link);

      script.onload = () => {
        const L = window.L;
        // Center on Mumbai with closer zoom level
        const mapInstance = L.map('map').setView([MUMBAI_LAT, MUMBAI_LNG], 11);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        const DefaultIcon = L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        L.Marker.prototype.options.icon = DefaultIcon;

        points.forEach(point => {
          L.marker([point.lat, point.lng])
            .bindPopup(point.name)
            .addTo(mapInstance);
        });

        setMap(mapInstance);
      };
    };

    loadLeaflet();

    return () => {
      const script = document.querySelector('script[src*="leaflet.js"]');
      const link = document.querySelector('link[href*="leaflet.css"]');
      if (script) document.body.removeChild(script);
      if (link) document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (map && window.L) {
      map.eachLayer((layer: any) => {
        if (layer instanceof window.L.Marker) {
          map.removeLayer(layer);
        }
      });

      points.forEach(point => {
        window.L.marker([point.lat, point.lng])
          .bindPopup(point.name)
          .addTo(map);
      });
    }
  }, [points, map]);

  const handleAddPoint = (): void => {
    if (newPoint.lat && newPoint.lng && newPoint.name) {
      const pointToAdd: Point = {
        lat: parseFloat(newPoint.lat),
        lng: parseFloat(newPoint.lng),
        name: newPoint.name
      };
      
      setPoints(prevPoints => [...prevPoints, pointToAdd]);
      setNewPoint({ lat: '', lng: '', name: '' });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof NewPoint
  ): void => {
    setNewPoint(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Mumbai Map Points</CardTitle>
      </CardHeader>
      <CardContent>
        
        
        <div id="map" className="h-96 w-full rounded-lg border"></div>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Points List</h3>
          <div className="space-y-2">
            {points.map((point, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded">
                {point.name}: {point.lat}, {point.lng}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapPointsViewer;