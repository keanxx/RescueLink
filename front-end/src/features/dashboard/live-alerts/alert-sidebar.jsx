import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Clock, AlertCircle } from 'lucide-react';

export default function AlertSidebar({ alerts, selectedAlert, onAlertSelect, onViewDetails }) {

  const activeAlerts = alerts.filter(a => a.status !== 'resolved' && a.status !== 'cancelled');

  return (
    <Card className="w-80">
      <CardContent className="p-4">
        <div className="mb-4">
          <h2 className="font-bold text-lg">Active Alerts</h2>
          <p className="text-xs text-muted-foreground">
            Total Alerts ({activeAlerts.length})
          </p>
        </div>

        <ScrollArea className="h-[650px]">
          <div className="space-y-2">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onAlertSelect(alert)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedAlert?.id === alert.id
                    ? 'bg-blue-50 border-blue-600 shadow-md'
                    : 'hover:bg-muted border-transparent'
                }`}
              >
                <div className="flex justify-end gap-2 mb-2 capitalize">
                  <Badge  className={
                      alert.status === 'resolved'
                        ? 'bg-green-500 text-white '
                        : alert.status === 'pending'
                        ? 'bg-orange-500 text-white '
                        : alert.status === 'verified'
                        ? 'bg-blue-500 text-white '
                        : 'bg-gray-500 text-white '
                    }
                  >{alert.status}</Badge>
                  <Badge
                    className={
                      alert.severity === 'critical'
                        ? 'bg-red-500 text-white'
                        : alert.severity === 'high'
                        ? 'bg-orange-500 text-white'
                        : alert.severity === 'medium'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-blue-500 text-white'
                    }
                  >
                    {alert.severity}
                  </Badge>
                </div>

                <p className="text-sm font-medium mb-1">
                  {alert.user 
                    ? `${alert.user.first_name} ${alert.user.last_name}` 
                    : 'Unknown User'}
                </p>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={12} />
                    {new Date(alert.reported_at).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground capitalize">
                    <AlertCircle size={12} />
                    {alert.alert_type.replace('_', ' ')}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(alert);
                  }}
                >
                  <Eye size={14} className="mr-1" />
                  Details
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
