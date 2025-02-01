"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  ChevronUp, 
  ChevronDown, 
  RefreshCw,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface StoreLocation {
  latitude: number;
  longitude: number;
  estimated_revenue: number;
  nearby_cities: string[];
}

declare global {
  interface Window {
    L: any;
  }
}

const StorePlacementRecommendations: React.FC = () => {
  const [locations, setLocations] = useState<StoreLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedLocation, setSelectedLocation] = useState<StoreLocation | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [map, setMap] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const linkRef = useRef<HTMLLinkElement | null>(null);

  // Fetch store placement recommendations
  const fetchStoreLocations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/store-placement-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ num_recommendations: 5 })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch store placement recommendations');
      }
      
      const data = await response.json();
      setLocations(data);
      
      if (data.length > 0) {
        const firstLocation = data[0];
        setSelectedLocation(firstLocation);
        if (map) {
          map.setView([firstLocation.latitude, firstLocation.longitude], 7);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize map
const initializeMap = () => {
  if (mapRef.current && window.L && !map) {
    const mapInstance = window.L.map(mapRef.current).setView([20.5937, 78.9629], 4);
    
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    setMap(mapInstance);
  }
};

useEffect(() => {
    // Create and append style element
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-container {
        height: 100%;
        width: 100%;
        z-index: 0 !important;
      }
      .leaflet-popup-content {
        font-size: 14px;
        line-height: 1.5;
      }
      .location-popup .revenue {
        color: #16a34a;
        font-weight: 600;
      }
    `;
    document.head.appendChild(style);
    styleRef.current = style;

    // Load Leaflet script and CSS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
    script.async = true;
    scriptRef.current = script;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
    linkRef.current = link;

    document.head.appendChild(link);
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize map after script is loaded
      initializeMap();
    };

    fetchStoreLocations();

    // Cleanup function
    return () => {
      if (map) {
        map.remove();
      }
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
      }
      if (linkRef.current) {
        document.head.removeChild(linkRef.current);
      }
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (map && window.L && locations.length > 0) {
      // Clear existing markers
      map.eachLayer((layer: any) => {
        if (layer instanceof window.L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add new markers
      locations.forEach(location => {
        const marker = window.L.marker([location.latitude, location.longitude])
          .bindPopup(`
            <div class="location-popup">
              <strong>Location Details</strong><br>
              Coordinates: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}<br>
              Estimated Revenue: ₹${location.estimated_revenue.toLocaleString()}<br>
              Nearby Cities: ${location.nearby_cities.join(', ')}
            </div>
          `);

        if (selectedLocation && 
            selectedLocation.latitude === location.latitude && 
            selectedLocation.longitude === location.longitude) {
          marker.openPopup();
        }

        marker.addTo(map);
      });
    }
  }, [locations, selectedLocation, map]);

  // Sort locations by estimated revenue
  const sortedLocations = React.useMemo(() => {
    return [...locations].sort((a, b) => 
      sortOrder === 'desc' 
        ? b.estimated_revenue - a.estimated_revenue 
        : a.estimated_revenue - b.estimated_revenue
    );
  }, [locations, sortOrder]);

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  // Handle location selection
  const handleLocationSelect = useCallback((location: StoreLocation) => {
    setSelectedLocation(location);
    if (map) {
      map.setView([location.latitude, location.longitude], 7);
      map.eachLayer((layer: any) => {
        if (layer instanceof window.L.Marker) {
          const markerLatLng = layer.getLatLng();
          if (markerLatLng.lat === location.latitude && 
              markerLatLng.lng === location.longitude) {
            layer.openPopup();
          }
        }
      });
    }
  }, [map]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading store placement recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <MapPin className="mr-2" /> Store Placement Recommendations
        </h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchStoreLocations}
          >
            <RefreshCw className="mr-2" size={16} /> Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="mr-2" size={16} />
            ) : (
              <Maximize2 className="mr-2" size={16} />
            )}
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isFullscreen ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-6`}>
        {/* Location Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Location Details
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleSortOrder}
              >
                {sortOrder === 'desc' ? (
                  <ChevronDown className="mr-2" size={16} />
                ) : (
                  <ChevronUp className="mr-2" size={16} />
                )}
                Sort by Revenue
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Estimated Revenue</TableHead>
                  <TableHead>Nearby Cities</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLocations.map((location, index) => (
                  <TableRow 
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className={`cursor-pointer hover:bg-muted ${
                      selectedLocation?.latitude === location.latitude && 
                      selectedLocation?.longitude === location.longitude ? 'bg-muted' : ''
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-2 text-muted-foreground" size={16} />
                        {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        ₹{location.estimated_revenue.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {location.nearby_cities.slice(0, 3).map((city) => (
                          <Badge key={city} variant="outline">
                            {city}
                          </Badge>
                        ))}
                        {location.nearby_cities.length > 3 && (
                          <Badge variant="outline">
                            +{location.nearby_cities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Map Card */}
        <Card className={`${isFullscreen ? 'fixed inset-0 z-50 m-0' : ''}`}>
          <CardHeader>
            <CardTitle>Store Placement Map</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div 
              ref={mapRef}
              style={{ height: '400px', width: '100%' }} className="rounded-lg"
            ></div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Location Details */}
      {selectedLocation && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Selected Location Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Coordinates</p>
                <p className="font-bold">
                  Latitude: {selectedLocation.latitude.toFixed(4)}, 
                  Longitude: {selectedLocation.longitude.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Estimated Revenue</p>
                <Badge variant="secondary" className="text-lg">
                  ₹{selectedLocation.estimated_revenue.toLocaleString()}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Nearby Cities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLocation.nearby_cities.map((city) => (
                    <Badge key={city} variant="outline">
                      {city}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StorePlacementRecommendations;