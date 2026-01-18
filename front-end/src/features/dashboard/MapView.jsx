import { APIProvider, Map } from '@vis.gl/react-google-maps';

function MapView() {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        style={{ width: '100%', height: '100vh' }}
        defaultCenter={{ lat: 14.1542, lng: 122.9623 }}
        defaultZoom={10}
      />
    </APIProvider>
  );
}

export default MapView;
