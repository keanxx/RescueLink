// components/alerts/map-modal.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { Badge } from '@/components/ui/badge';
import { useEffect, useRef } from 'react';

// Fix Leaflet default marker icon
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const createCustomIcon = (severity) => {
  const colors = {
    critical: '#dc2626',
    high: '#ea580c',
    medium: '#ca8a04',
    low: '#3b82f6',
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${colors[severity]};
        width: 35px;
        height: 35px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 18px;
      ">⚠</div>
    `,
    iconSize: [35, 35],
    iconAnchor: [17.5, 17.5],
  });
};

// Map controller to update view when alert changes
function MapController({ center, map }) {
  useEffect(() => {
    if (center && map) {
      map.setView(center, 15, { animate: true });
    }
  }, [center, map]);

  return null;
}

export default function MapModal({ open, onOpenChange, alert }) {
  const mapRef = useRef(null);

  if (!alert || !alert.latitude || !alert.longitude) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Alert Location</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-[500px] text-muted-foreground">
            No location data available for this alert
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const position = [alert.latitude, alert.longitude];
  const camNorteBounds = [
    [13.95, 122.40],
    [14.45, 123.10],
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            Alert Location - {alert.title}
          </DialogTitle>
        </DialogHeader>
        
        {/* Alert Info Bar */}
        <div className="flex items-center gap-4 p-3 bg-muted rounded-lg text-sm">
          <div>
            <span className="font-semibold">Alert ID:</span> #{alert.id}
          </div>
          <div>
            <span className="font-semibold">Type:</span> {alert.alert_type.replace('_', ' ')}
          </div>
          <div>
            <span className="font-semibold">Severity:</span>{' '}
            <Badge
              className={
                alert.severity === 'critical'
                  ? 'bg-red-100 text-red-700'
                  : alert.severity === 'high'
                  ? 'bg-orange-100 text-orange-700'
                  : alert.severity === 'medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-blue-100 text-blue-700'
              }
            >
              {alert.severity}
            </Badge>
          </div>
          <div className="flex-1 text-right">
            <span className="font-semibold">Location:</span> {alert.location}
          </div>
        </div>

        {/* Map */}
        <div className="h-[500px] rounded-lg overflow-hidden border">
          <MapContainer
            center={position}
            zoom={15}
            minZoom={10}
            maxZoom={18}
            maxBounds={camNorteBounds}
            maxBoundsViscosity={1.0}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
            whenCreated={(map) => {
              mapRef.current = map;
            }}
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer name="Street Map">
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>

              <LayersControl.BaseLayer checked name="Satellite">
                <TileLayer
                  attribution='&copy; Google'
                  url="http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}"
                />
              </LayersControl.BaseLayer>

              <LayersControl.BaseLayer name="Hybrid">
                <TileLayer
                  attribution='&copy; Google'
                  url="http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
                />
              </LayersControl.BaseLayer>

              <LayersControl.BaseLayer name="Terrain">
                <TileLayer
                  attribution='&copy; Google'
                  url="http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}"
                />
              </LayersControl.BaseLayer>
            </LayersControl>

            <Marker
              position={position}
              icon={createCustomIcon(alert.severity)}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">#{alert.id}</span>
                    <Badge
                      className={
                        alert.severity === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : alert.severity === 'high'
                          ? 'bg-orange-100 text-orange-700'
                          : alert.severity === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold mb-1">{alert.title}</p>
                  {alert.user && (
                    <p className="text-xs text-muted-foreground">
                      Reported by: {alert.user.first_name} {alert.user.last_name}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.alert_type.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(alert.reported_at).toLocaleString()}
                  </p>
                  {alert.description && (
                    <p className="text-xs mt-2">{alert.description}</p>
                  )}
                </div>
              </Popup>
            </Marker>

            <MapController center={position} map={mapRef.current} />
          </MapContainer>
        </div>

        {/* Coordinates */}
        <div className="text-xs text-muted-foreground text-center">
          Coordinates: {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
        </div>
      </DialogContent>
    </Dialog>
  );
}
