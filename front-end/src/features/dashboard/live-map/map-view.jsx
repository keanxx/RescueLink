import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { MAP_CENTER, DEFAULT_ZOOM, MARKER_ZOOM, TILE_STYLES, createAccidentIcon } from './mapConfig.jsx';
import MapLegend from './map-legend.jsx';

// Component to handle auto-zoom when alert is selected
function MapController({ selectedAlert }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedAlert) {
      // Zoom to selected alert
      map.setView(
        [selectedAlert.latitude, selectedAlert.longitude], 
        MARKER_ZOOM, 
        { animate: true, duration: 1 }
      );
    }
  }, [selectedAlert, map]);
  
  return null;
}

// Marker with zoom and modal trigger on click
function MarkerWithClick({ position, icon, onClick }) {
  const map = useMap();
  
  return (
    <Marker 
      position={position}
      icon={icon}
      eventHandlers={{
        click: () => {
          // Zoom to marker
          map.setView(position, MARKER_ZOOM, { animate: true, duration: 1 });
          // Open modal
          onClick();
        }
      }}
    />
  );
}

function AccidentMap({ alerts = [], selectedAlert = null, onMarkerClick }) {
  const [mapStyle, setMapStyle] = useState('street');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
const activeAlerts = alerts.filter(a => a.status !== 'resolved' && a.status !== 'cancelled');
  return (
    <div className="w-full h-full relative">
      {/* Layer Control */}
      <div className="absolute top-3 right-4 z-[1000]">
        <button
          onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
          className="bg-white w-8 h-8 rounded border-2 border-gray-400 shadow-md hover:bg-gray-50 flex items-center justify-center"
          title="Layers"
        >
          <Layers size={18} className="text-gray-700" />
        </button>

        {isLayerMenuOpen && (
          <div className="absolute top-10 right-0 bg-white rounded border-2 border-gray-400 shadow-lg p-3 min-w-[150px]">
            <div className="text-xs font-semibold text-gray-700 mb-2">Base Layers</div>
            
            <label className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio"
                name="mapStyle"
                checked={mapStyle === 'street'}
                onChange={() => setMapStyle('street')}
                className="cursor-pointer"
              />
              <span className="text-sm">Street</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio"
                name="mapStyle"
                checked={mapStyle === 'satellite'}
                onChange={() => setMapStyle('satellite')}
                className="cursor-pointer"
              />
              <span className="text-sm">Satellite</span>
            </label>
          </div>
        )}
      </div>

      {/* Legend */}
      <MapLegend />

      {/* Map */}
      <MapContainer 
        center={MAP_CENTER} 
        zoom={DEFAULT_ZOOM} 
        className="h-full w-full z-0"
      >
        {/* Auto-zoom controller */}
        <MapController selectedAlert={selectedAlert} />
        
        <TileLayer
          key={mapStyle}
          attribution={TILE_STYLES[mapStyle].attribution}
          url={TILE_STYLES[mapStyle].url}
        />
        
        {/* Markers without Popup - just click to open modal */}
        {activeAlerts.map((alert) => (
          <MarkerWithClick
            key={alert.id}
            position={[alert.latitude, alert.longitude]}
            icon={createAccidentIcon(alert.severity)}
            onClick={() => onMarkerClick(alert)}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default AccidentMap;
