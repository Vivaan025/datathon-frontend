import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';

interface Point {
  lat: number;
  lng: number;
  name: string;
  revenue: number;
}

interface NewPoint {
  lat: string;
  lng: string;
  name: string;
  revenue: string;
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
  const MUMBAI_LAT = 19.0760;
  const MUMBAI_LNG = 72.8777;

  const [points, setPoints] = useState<Point[]>([
    { lat: MUMBAI_LAT, lng: MUMBAI_LNG, name: 'Mumbai Central', revenue: 500000 },
    { lat: 19.0883, lng: 72.8359, name: 'Bandra', revenue: 350000 },
    { lat: 19.0178, lng: 72.8478, name: 'Worli', revenue: 420000 },
    { lat: 18.9548, lng: 72.8224, name: 'Colaba', revenue: 280000 }
  ]);

  const [newPoint, setNewPoint] = useState<NewPoint>({
    lat: '',
    lng: '',
    name: '',
    revenue: ''
  });
  
  const [map, setMap] = useState<any>(null);

  // Format currency in Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      #map {
    z-index: 0 !important; 
  }
      .leaflet-default-icon-path {
        background-image: url(https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png);
      }
      .leaflet-marker-icon {
        background-image: url(https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png);
        background-size: contain;
      }
      .location-popup {
        font-size: 14px;
        line-height: 1.5;
      }
      .location-popup .revenue {
        color: #16a34a;
        font-weight: 600;
      }
      .modal {
    z-index: 1050 !important; /* Ensure modal stays on top */
    position: relative;
  }
    `;
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
            .bindPopup(`
              <div class="location-popup">
                <strong>${point.name}</strong><br>
                Expected Revenue: <span class="revenue">${formatCurrency(point.revenue)}</span>
              </div>
            `)
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
          .bindPopup(`
            <div class="location-popup">
              <strong>${point.name}</strong><br>
              Expected Revenue: <span class="revenue">${formatCurrency(point.revenue)}</span>
            </div>
          `)
          .addTo(map);
      });
    }
  }, [points, map]);

  const handleAddPoint = (): void => {
    if (newPoint.lat && newPoint.lng && newPoint.name && newPoint.revenue) {
      const pointToAdd: Point = {
        lat: parseFloat(newPoint.lat),
        lng: parseFloat(newPoint.lng),
        name: newPoint.name,
        revenue: parseFloat(newPoint.revenue)
      };
      
      setPoints(prevPoints => [...prevPoints, pointToAdd]);
      setNewPoint({ lat: '', lng: '', name: '', revenue: '' });
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
        <CardTitle>Mumbai Revenue Map</CardTitle>
      </CardHeader>
      <CardContent>
        
        
        <div id="map" className="h-96 w-full rounded-lg border"></div>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Revenue by Location</h3>
          <div className="space-y-2">
            {points.map((point, index) => (
              <div key={index} className="p-3 bg-gray-100 rounded flex justify-between items-center">
                <span>{point.name}</span>
                <span className="text-green-600 font-semibold">{formatCurrency(point.revenue)}</span>
              </div>
            ))}
            <div className="p-3 bg-gray-200 rounded flex justify-between items-center font-semibold">
              <span>Total Expected Revenue</span>
              <span className="text-green-600">
                {formatCurrency(points.reduce((sum, point) => sum + point.revenue, 0))}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapPointsViewer;