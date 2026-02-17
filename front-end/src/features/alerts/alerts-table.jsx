import { useState, useEffect } from "react";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { AlertCircle, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { alertsAPI } from "@/api/alerts";
import { useNavigate } from "react-router-dom"; // ✅ Add this

export default function AlertsTable() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ Add this

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await alertsAPI.getAll();
      setAlerts(data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load',
        text: error || 'Could not fetch alerts',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Replace handleViewOnMap with navigation
  const handleViewOnMap = (alert) => {
    navigate('/map', { state: { selectedAlert: alert } });
  };

  const handleView = async (alert) => {
    try {
      const data = await alertsAPI.getById(alert.id);
      setSelectedAlert(data);
      
      Swal.fire({
        title: data.title,
        html: `
          <div class="text-left space-y-2">
            <p><strong>Type:</strong> ${data.alert_type}</p>
            <p><strong>Severity:</strong> ${data.severity}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Description:</strong> ${data.description || 'N/A'}</p>
            <p><strong>Reported:</strong> ${new Date(data.reported_at).toLocaleString()}</p>
          </div>
        `,
        confirmButtonColor: '#dc2626',
      });
    } catch (error) {
      console.error('Failed to fetch alert details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load',
        text: error || 'Could not fetch alert details',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  const handleStatusChange = async (alert, newStatus) => {
    try {
      const updated = await alertsAPI.updateStatus(alert.id, newStatus);
      setAlerts(alerts.map(a => a.id === updated.id ? updated : a));
      
      Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `Alert marked as ${newStatus}`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error || 'Could not update alert status',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  const handleAssign = async (alert, vehicle_id, responder_id) => {
    try {
      const updated = await alertsAPI.assign(alert.id, vehicle_id, responder_id);
      setAlerts(alerts.map(a => a.id === updated.id ? updated : a));
      
      Swal.fire({
        icon: 'success',
        title: 'Assigned!',
        text: 'Responder and vehicle assigned successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Failed to assign:', error);
      Swal.fire({
        icon: 'error',
        title: 'Assignment Failed',
        text: error || 'Could not assign responder',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  const handleDelete = (alert) => {
    setDeleteAlert(alert);
  };

  const handleDeleteConfirm = async () => {
    try {
      await alertsAPI.delete(deleteAlert.id);
      
      setAlerts(alerts.filter(a => a.id !== deleteAlert.id));
      setDeleteAlert(null);

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Alert has been deleted successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Failed to delete alert:', error);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: error || 'Could not delete alert',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  const columns = createColumns(handleView, handleStatusChange, handleAssign, handleDelete, handleViewOnMap);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Alert Management</h1>
          <p className="text-gray-600 mt-1">Monitor and respond to emergency alerts</p>
        </div>
      </div>
     
      <DataTable columns={columns} data={alerts} />

      {/* ❌ REMOVED: MapModal component */}
      
      <AlertDialog open={!!deleteAlert} onOpenChange={(open) => !open && setDeleteAlert(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete alert <strong>#{deleteAlert?.id}</strong> - {deleteAlert?.title}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
