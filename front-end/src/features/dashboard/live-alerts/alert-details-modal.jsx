import React, { useState, useEffect } from "react";
import { MapPin, Clock, User, Phone, Smartphone, CheckCircle, Truck, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { alertsAPI } from '@/api/alerts';
import { usersAPI } from '@/api/users';
import { vehiclesAPI } from '@/api/vehicles';

export default function AlertDetailsModal({ open, onOpenChange, alert, onUpdateAlert }) {
    if (!alert) return null;
  const [isUpdating, setIsUpdating] = useState(false);
  const [responders, setResponders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedResponderId, setSelectedResponderId] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [loading, setLoading] = useState(false);



  // Fetch responders and vehicles when modal opens
  useEffect(() => {
    if (open) {
      fetchRespondersAndVehicles();
    }
  }, [open]);

  // Set selected values if already assigned
  useEffect(() => {
    if (alert) {
      setSelectedResponderId(alert.assigned_responder_id || null);
      setSelectedVehicleId(alert.assigned_vehicle_id || null);
    }
  }, [alert]);

  const fetchRespondersAndVehicles = async () => {
    try {
      setLoading(true);
      
      // Fetch both in parallel using your existing APIs
      const [respondersData, vehiclesData] = await Promise.all([
        usersAPI.getAll({ role: 'responder' }),
        vehiclesAPI.getAll({ status: 'available' })
      ]);

      console.log('Responders:', respondersData);
      console.log('Vehicles:', vehiclesData);

      setResponders(respondersData);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const severityColors = {
    critical: "bg-red-100 text-red-700 border-red-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    responding: "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-700",
  };

  const handleVerify = async () => {
    try {
      setIsUpdating(true);
      const updatedAlert = await alertsAPI.updateStatus(alert.id, 'responding');
      onUpdateAlert(updatedAlert);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResolve = async () => {
    try {
      setIsUpdating(true);
      const updatedAlert = await alertsAPI.updateStatus(alert.id, 'resolved');
      onUpdateAlert(updatedAlert);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignResponder = async () => {
    if (!selectedResponderId || !selectedVehicleId) {
      alert('Please select both responder and vehicle');
      return;
    }

    try {
      setIsUpdating(true);
      
      // Call your assign API
      const updatedAlert = await alertsAPI.assign(
        alert.id, 
        selectedVehicleId, 
        selectedResponderId
      );

      console.log('Assignment successful:', updatedAlert);
      onUpdateAlert(updatedAlert);
      alert('Responder and vehicle assigned successfully!');
    } catch (error) {
      console.error('Error assigning:', error);
      alert('Failed to assign responder');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Alert Details</DialogTitle>
          <p className="text-sm text-muted-foreground">ID: #{alert.id}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status & Severity */}
          <div className="flex flex-wrap gap-3">
            <Badge className={`px-4 py-2 ${severityColors[alert.severity]}`}>
              {alert.severity} Severity
            </Badge>
            <Badge className={`px-4 py-2 ${statusColors[alert.status]}`}>
              {alert.status}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              {alert.alert_type.replace("_", " ")}
            </Badge>
          </div>

          {/* Title */}
          <div>
            <h3 className="font-semibold text-lg">{alert.title || `${alert.alert_type} Alert`}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {alert.description || "No description available"}
            </p>
          </div>

          {/* User Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold">User Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Info icon={<User size={18} />} label="Name">
                  {alert.user?.first_name} {alert.user?.last_name}
                </Info>
                <Info icon={<Smartphone size={18} />} label="Email">
                  {alert.user?.email || "N/A"}
                </Info>
                <Info icon={<Phone size={18} />} label="Phone">
                  {alert.user?.user_phone_number || "N/A"}
                </Info>
                <Info icon={<Clock size={18} />} label="Alert Time">
                  {new Date(alert.reported_at).toLocaleString()}
                </Info>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin size={18} className="text-red-600" />
              Location
            </h3>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-medium">{alert.location || "Location not specified"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Coordinates: {alert.latitude}, {alert.longitude}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Assignment Section */}
          {(alert.status === 'pending' || alert.status === 'responding') && (
            <Card className="border-2 border-blue-200 bg-blue-50/50">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users size={18} />
                  Assign Responder & Vehicle
                </h3>

                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading options...</p>
                ) : (
                  <>
                    {/* Responder Selector */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Responder</label>
                      <Select 
                        value={selectedResponderId?.toString()} 
                        onValueChange={(value) => setSelectedResponderId(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a responder..." />
                        </SelectTrigger>
                        <SelectContent>
                          {responders.length === 0 ? (
                            <SelectItem value="none" disabled>No responders available</SelectItem>
                          ) : (
                            responders.map((responder) => (
                              <SelectItem key={responder.id} value={responder.id.toString()}>
                                {responder.first_name} {responder.last_name} - {responder.user_phone_number || 'No phone'}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Vehicle Selector */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Vehicle</label>
                      <Select 
                        value={selectedVehicleId?.toString()} 
                        onValueChange={(value) => setSelectedVehicleId(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a vehicle..." />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.length === 0 ? (
                            <SelectItem value="none" disabled>No vehicles available</SelectItem>
                          ) : (
                            vehicles.map((vehicle) => (
                              <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                                {vehicle.license_plate} - {vehicle.vehicle_type} ({vehicle.model})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Assign Button */}
                    <Button 
                      onClick={handleAssignResponder} 
                      className="w-full"
                      disabled={!selectedResponderId || !selectedVehicleId || isUpdating}
                    >
                      <Truck size={18} className="mr-2" />
                      {isUpdating ? 'Assigning...' : 'Assign Responder & Vehicle'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Current Assignment (if exists) */}
          {(alert.vehicle || alert.responder) && (
            <Card className="bg-green-50/50 border-green-200">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-green-800">Current Assignment</h3>
                {alert.responder && (
                  <div className="flex items-center gap-2 text-sm">
                    <User size={16} className="text-green-600" />
                    <span>
                      <strong>Responder:</strong> {alert.responder.first_name} {alert.responder.last_name}
                      {alert.responder.user_phone_number && ` - ${alert.responder.user_phone_number}`}
                    </span>
                  </div>
                )}
                {alert.vehicle && (
                  <div className="flex items-center gap-2 text-sm">
                    <Truck size={16} className="text-blue-600" />
                    <span>
                      <strong>Vehicle:</strong> {alert.vehicle.license_plate} - {alert.vehicle.vehicle_type}
                      {alert.vehicle.model && ` (${alert.vehicle.model})`}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {alert.status === "pending" && (
              <Button 
                onClick={handleVerify} 
                className="flex-1"
                disabled={isUpdating}
              >
                <CheckCircle size={18} className="mr-2" />
                {isUpdating ? 'Updating...' : 'Mark as Responding'}
              </Button>
            )}
            {alert.status !== "resolved" && (
              <Button 
                onClick={handleResolve} 
                className="flex-1" 
                variant="outline"
                disabled={isUpdating}
              >
                <CheckCircle size={18} className="mr-2" />
                {isUpdating ? 'Updating...' : 'Mark as Resolved'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Reusable Info Component
function Info({ icon, label, children }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{children}</p>
      </div>
    </div>
  );
}
