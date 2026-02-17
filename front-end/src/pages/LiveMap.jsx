import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import { alertsAPI } from '@/api/alerts';
import AlertDetailsModal from '@/features/dashboard/live-alerts/alert-details-modal';
import AccidentMap from '@/features/dashboard/live-map/map-view';
import AlertSidebar from '@/features/dashboard/live-alerts/alert-sidebar';

const LiveMap = () => {
  const location = useLocation(); // ✅ Add this
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsAlert, setDetailsAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch alerts when component mounts
  useEffect(() => {
    fetchAlerts();
  }, []);

  // ✅ Check if alert was passed from navigation
  useEffect(() => {
    if (location.state?.selectedAlert) {
      const alert = location.state.selectedAlert;
      setSelectedAlert(alert);
      
      // Optional: Open modal automatically
      setDetailsAlert(alert);
      setDetailsModalOpen(true);
    }
  }, [location.state]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await alertsAPI.getAll();
      console.log('Fetched alerts:', data);
      setAlerts(data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleAlertSelect = (alert) => {
    setSelectedAlert(alert);
  };

  const handleViewDetails = (alert) => {
    setDetailsAlert(alert);
    setDetailsModalOpen(true);
  };

  const handleMarkerClick = (alert) => {
    setSelectedAlert(alert);
    setDetailsAlert(alert);
    setDetailsModalOpen(true);
  };

  const handleUpdateAlert = (updatedAlert) => {
    setAlerts(alerts.map(a => a.id === updatedAlert.id ? updatedAlert : a));
    setDetailsAlert(updatedAlert);
    
    if (selectedAlert?.id === updatedAlert.id) {
      setSelectedAlert(updatedAlert);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={fetchAlerts}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen w-full flex">
        <AlertSidebar
          alerts={alerts}
          selectedAlert={selectedAlert}
          onAlertSelect={handleAlertSelect}
          onViewDetails={handleViewDetails}
        />
        
        <div className="flex-1">
          <AccidentMap 
            alerts={alerts}
            selectedAlert={selectedAlert}
            onMarkerClick={handleMarkerClick}
          />
        </div>
      </div>

      <AlertDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        alert={detailsAlert}
        onUpdateAlert={handleUpdateAlert}
      />
    </>
  );
};

export default LiveMap;
