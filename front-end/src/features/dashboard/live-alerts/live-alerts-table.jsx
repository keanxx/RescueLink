import { useState } from 'react';
import { Clock, MapPin, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import AlertDetailsModal from './alert-details-modal';

const alerts = [
  {
    id: 'A-1234',
    timestamp: '2 min ago',
    severity: 'Critical',
    location: '14.5995° N, 120.9842° E',
    type: 'Auto Crash Detection',
    user: 'Juan Dela Cruz',
    device: 'Samsung Galaxy S21',
    status: 'Pending',
  },
  {
    id: 'A-1233',
    timestamp: '8 min ago',
    severity: 'High',
    location: '14.6091° N, 121.0223° E',
    type: 'Manual SOS',
    user: 'Maria Santos',
    device: 'iPhone 13',
    status: 'Verified',
  },
  {
    id: 'A-1232',
    timestamp: '15 min ago',
    severity: 'Medium',
    location: '14.5547° N, 121.0244° E',
    type: 'Auto Crash Detection',
    user: 'Pedro Garcia',
    device: 'OnePlus 9',
    status: 'Pending',
  },
  {
    id: 'A-1231',
    timestamp: '22 min ago',
    severity: 'Critical',
    location: '14.5832° N, 120.9789° E',
    type: 'Manual SOS',
    user: 'Ana Reyes',
    device: 'Xiaomi Redmi Note 10',
    status: 'Resolved',
  },
  {
    id: 'A-1230',
    timestamp: '35 min ago',
    severity: 'High',
    location: '14.6234° N, 121.0156° E',
    type: 'Auto Crash Detection',
    user: 'Carlos Ramos',
    device: 'Samsung Galaxy A52',
    status: 'Verified',
  },
];

const severityColors = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
};

export default function LiveAlertsTable() {
  const [selectedAlert, setSelectedAlert] = useState(null);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Live Alerts Feed</CardTitle>
          <CardDescription>Recent SOS alerts</CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="divide-y">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  onClick={() => setSelectedAlert(alert)}
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium">{alert.id}</span>
                    <Badge className={severityColors[alert.severity]}>
                      {alert.severity}
                    </Badge>
                  </div>
                  
                  <p className="text-sm font-medium mb-2">{alert.user}</p>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={14} />
                      <span>{alert.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin size={14} />
                      <span className="truncate">{alert.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <AlertCircle size={14} />
                      <span>{alert.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedAlert && (
        <AlertDetailsModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onVerify={() => {
            console.log('Verify alert:', selectedAlert.id);
            setSelectedAlert(null);
          }}
          onResolve={() => {
            console.log('Resolve alert:', selectedAlert.id);
            setSelectedAlert(null);
          }}
          onAssignResponder={() => {
            console.log('Assign responder:', selectedAlert.id);
          }}
        />
      )}
    </>
  );
}
