import { useState, useEffect, useMemo } from "react";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { Loader2, X } from "lucide-react";
import Swal from "sweetalert2";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { alertsAPI } from "@/api/alerts";
import { useNavigate } from "react-router-dom";
import { socket } from "@/lib/socket";



// ── Helpers ────────────────────────────────────────────────
const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-700';
    case 'high':     return 'bg-orange-100 text-orange-700';
    case 'medium':   return 'bg-yellow-100 text-yellow-700';
    case 'low':      return 'bg-green-100 text-green-700';
    default:         return 'bg-gray-100 text-gray-700';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':    return 'bg-yellow-100 text-yellow-700';
    case 'responding': return 'bg-blue-100 text-blue-700';
    case 'resolved':   return 'bg-green-100 text-green-700';
    default:           return 'bg-gray-100 text-gray-700';
  }
};


export default function AlertsTable({ statusFilter }) {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // ── Initial fetch ──────────────────────────────────────────
  useEffect(() => {
    fetchAlerts();
  }, []);


  // ── Socket listeners ───────────────────────────────────────
  useEffect(() => {
    function onNewAlert(newAlert) {
      setAlerts(prev => [newAlert, ...prev]);
    }
    function onUpdatedAlert(updated) {
      setAlerts(prev => prev.map(a => a.id === updated.id ? updated : a));
    }
    function onStatusUpdated(updated) {
      setAlerts(prev => prev.map(a => a.id === updated.id ? { ...a, ...updated } : a));
    }
    function onAssigned(updated) {
      setAlerts(prev => prev.map(a => a.id === updated.id ? updated : a));
    }
    function onDeleted({ id }) {
      setAlerts(prev => prev.filter(a => a.id !== Number(id)));
    }

    socket.on("alert:new", onNewAlert);
    socket.on("alert:updated", onUpdatedAlert);
    socket.on("alert:status_updated", onStatusUpdated);
    socket.on("alert:assigned", onAssigned);
    socket.on("alert:deleted", onDeleted);

    return () => {
      socket.off("alert:new", onNewAlert);
      socket.off("alert:updated", onUpdatedAlert);
      socket.off("alert:status_updated", onStatusUpdated);
      socket.off("alert:assigned", onAssigned);
      socket.off("alert:deleted", onDeleted);
    };
  }, []);


  // ── API functions ──────────────────────────────────────────
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await alertsAPI.getAll();
      setAlerts(data);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Failed to Load', text: error || 'Could not fetch alerts', confirmButtonColor: '#dc2626' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewOnMap = (alert) => {
    navigate('/map', { state: { selectedAlert: alert } });
  };

  const filteredAlerts = useMemo(() => {
    if (!statusFilter) return alerts;
    return alerts.filter(alert => statusFilter.includes(alert.status));
  }, [alerts, statusFilter]);

  const handleView = async (alert) => {
    try {
      const data = await alertsAPI.getById(alert.id);
      setSelectedAlert(data);
      setViewOpen(true);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Failed to Load', text: error || 'Could not fetch alert details', confirmButtonColor: '#dc2626' });
    }
  };

  const handleStatusChange = async (alert, newStatus) => {
    try {
      const updated = await alertsAPI.updateStatus(alert.id, newStatus);
      setAlerts(prev => prev.map(a => a.id === updated.id ? updated : a));
      Swal.fire({ icon: 'success', title: 'Status Updated!', text: `Alert marked as ${newStatus}`, timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Update Failed', text: error || 'Could not update alert status', confirmButtonColor: '#dc2626' });
    }
  };

  const handleAssign = async (alert, vehicle_id, responder_id) => {
    try {
      const updated = await alertsAPI.assign(alert.id, vehicle_id, responder_id);
      setAlerts(prev => prev.map(a => a.id === updated.id ? updated : a));
      Swal.fire({ icon: 'success', title: 'Assigned!', text: 'Responder and vehicle assigned successfully', timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Assignment Failed', text: error || 'Could not assign responder', confirmButtonColor: '#dc2626' });
    }
  };

  const handleDelete = (alert) => setDeleteAlert(alert);

  const handleDeleteConfirm = async () => {
    try {
      await alertsAPI.delete(deleteAlert.id);
      setAlerts(prev => prev.filter(a => a.id !== deleteAlert.id));
      setDeleteAlert(null);
      Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Alert has been deleted successfully', timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Delete Failed', text: error || 'Could not delete alert', confirmButtonColor: '#dc2626' });
    }
  };

  const columns = useMemo(
    () => createColumns(handleView, handleStatusChange, handleAssign, handleDelete, handleViewOnMap),
    []
  );


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

      <DataTable columns={columns} data={filteredAlerts} hideStatusFilter={!!statusFilter} />


      {/* ── View Alert Dialog ───────────────────────────────── */}
      <Dialog open={viewOpen} onOpenChange={(open) => {
        setViewOpen(open);
        if (!open) setImagePreviewOpen(false); // close preview if view closes
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedAlert?.title}</DialogTitle>
          </DialogHeader>

          {selectedAlert && (
            <Card className="border-0 shadow-none">
              <CardContent className="space-y-4 p-0 pt-2">

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getSeverityColor(selectedAlert.severity)}>
                    {selectedAlert.severity?.toUpperCase()}
                  </Badge>
                  <Badge className={getStatusColor(selectedAlert.status)}>
                    {selectedAlert.status?.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    {selectedAlert.alert_type}
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-600 w-24 shrink-0">Location:</span>
                    <span>{selectedAlert.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-600 w-24 shrink-0">Description:</span>
                    <span>{selectedAlert.description || 'N/A'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-600 w-24 shrink-0">Reported:</span>
                    <span>{new Date(selectedAlert.reported_at).toLocaleString()}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-600 w-24 shrink-0">Reported By:</span>
                    <span>
                      {selectedAlert.user
                        ? `${selectedAlert.user.first_name} ${selectedAlert.user.last_name}`
                        : 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Image Thumbnail — click to enlarge */}
                {selectedAlert.image_url && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Photo:</p>
                    <img
                      src={selectedAlert.image_url}
                      alt="Alert"
                      className="w-full rounded-lg object-cover max-h-48 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setImagePreviewOpen(true)}
                    />
                    <p className="text-xs text-gray-400 mt-1">Click image to enlarge</p>
                  </div>
                )}

              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>


{/* ── Image Fullscreen Overlay ───────────────────────────── */}
{imagePreviewOpen && (
  <div
    className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
    onClick={() => setImagePreviewOpen(false)}  // click anywhere to close
  >
    {/* Close button */}
    <button
      className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
      onClick={() => setImagePreviewOpen(false)}
    >
      <X className="h-6 w-6" />
    </button>

    {/* Full size image */}
    <img
      src={selectedAlert?.image_url}
      alt="Alert full view"
      className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl"
      onClick={(e) => e.stopPropagation()} // prevent close when clicking image itself
    />
  </div>
)}


      {/* ── Delete Confirmation Dialog ──────────────────────── */}
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
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
