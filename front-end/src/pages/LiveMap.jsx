import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import { alertsAPI } from '@/api/alerts';
import AlertDetailsModal from '@/features/dashboard/live-alerts/alert-details-modal';
import AccidentMap from '@/features/dashboard/live-map/map-view';
import AlertSidebar from '@/features/dashboard/live-alerts/alert-sidebar';
import { socket } from '@/lib/socket';

const LiveMap = () => {
  const location = useLocation(); 
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

  useEffect(() => {
    
    function onNewAlert(newAlert) { 
      setAlerts(prev => [newAlert, ...prev]);
    }

    function onStatusUpdated(updated) {
      setAlerts(prev => prev.map(a => a.id === updated.id ?{ ...a, ...updated } : a));

      setSelectedAlert(prev =>
        prev?.id === updated.id ? { ...prev, ...updated } : prev
      );
      setDetailsAlert(prev =>
        prev?.id === updated.id ? { ...prev, ...updated } : prev
      );
    }

    function onAssigned(updated) {
      setAlerts(prev => prev.map(a => a.id === updated.id ? updated : a));

      setSelectedAlert(prev =>
        prev?.id === updated.id ? updated : prev
      );
      setDetailsAlert(prev =>
        prev?.id === updated.id ? updated : prev
      );
    }

    function onUpdated(updated) {
      setAlerts(prev => prev.map(a => a.id === updated.id ? updated : a));

    }

    function onDeleted({ id }) {
      const deletedId = Number(id);

      setAlerts(prev => prev.filter(a => a.id !== deletedId));

      // If the deleted alert was open in the modal, close it
      setSelectedAlert(prev => prev?.id === deletedId ? null : prev);
      setDetailsAlert(prev => prev?.id === deletedId ? null : prev);
      setDetailsModalOpen(prev => {
        // close modal only if the deleted alert was the one being viewed
        return prev && detailsAlert?.id === deletedId ? false : prev;
      });
    }

     socket.on('alert:new', onNewAlert);
    socket.on('alert:status_updated', onStatusUpdated);
    socket.on('alert:assigned', onAssigned);
    socket.on('alert:updated', onUpdated);
    socket.on('alert:deleted', onDeleted);

     return () => {
      socket.off('alert:new', onNewAlert);
      socket.off('alert:status_updated', onStatusUpdated);
      socket.off('alert:assigned', onAssigned);
      socket.off('alert:updated', onUpdated);
      socket.off('alert:deleted', onDeleted);
    };

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
    // ✅ functional updater — fixes stale closure
    setAlerts(prev => prev.map(a => a.id === updatedAlert.id ? updatedAlert : a));
    setDetailsAlert(updatedAlert);
    setSelectedAlert(prev =>
      prev?.id === updatedAlert.id ? updatedAlert : prev
    );
  };

  // ── Render ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
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
          <button onClick={fetchAlerts} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen w-full flex gap-4">
        <AlertSidebar
          alerts={alerts}
          selectedAlert={selectedAlert}
          onAlertSelect={handleAlertSelect}
          onViewDetails={handleViewDetails}
        />
        
        <div className="flex-1 rounded-lg overflow-hidden">
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
