import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, CheckCircle, Pin, MoreHorizontal, Trash2 } from "lucide-react";

export const createColumns = (onView, onStatusChange, onAssign, onDelete, onViewOnMap) => [
  {
    accessorKey: "user",
    header: "USER",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div>
          <div className="font-medium text-sm">
            {user ? `${user.first_name} ${user.last_name}` : 'Unknown User'}
          </div>
          <div className="text-xs text-muted-foreground">
            {user?.email || 'N/A'}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "TITLE",
    cell: ({ row }) => (
      <div>
        <div className="text-sm font-medium">{row.original.title}</div>
        <div className="text-xs text-muted-foreground line-clamp-1">
          {row.original.description || 'No description'}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "LOCATION",
    cell: ({ row }) => (
      <div>
        <div className="text-sm font-medium">{row.original.location}</div>
        {row.original.latitude && row.original.longitude && (
          <div className="text-xs text-muted-foreground">
            {row.original.latitude.toFixed(4)}, {row.original.longitude.toFixed(4)}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status;
      const variantMap = {
        pending: "bg-orange-100 text-orange-700",
        responding: "bg-blue-100 text-blue-700",
        resolved: "bg-green-100 text-green-700",
        cancelled: "bg-gray-100 text-gray-700",
      };
      return (
        <Badge className={`font-medium ${variantMap[status] || 'bg-gray-100 text-gray-700'}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "alert_type",
    header: "TYPE",
    cell: ({ row }) => {
      const type = row.original.alert_type;
      return (
        <span className="text-sm capitalize">
          {type.replace('_', ' ')}
        </span>
      );
    },
  },
  {
    accessorKey: "severity",
    header: "SEVERITY",
    cell: ({ row }) => {
      const severity = row.original.severity;
      const variantMap = {
        critical: "bg-red-100 text-red-700",
        high: "bg-orange-100 text-orange-700",
        medium: "bg-yellow-100 text-yellow-700",
        low: "bg-blue-100 text-blue-700",
      };
      return (
        <Badge className={`font-medium capitalize ${variantMap[severity]}`}>
          {severity}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => {
      const alert = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            title="View Details"
            onClick={() => onView(alert)}
          >
            <Eye className="h-4 w-4" />
          </Button>

          {alert.status === "pending" && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              title="Mark as Responding"
              onClick={() => onStatusChange(alert, 'responding')}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}

          {alert.latitude && alert.longitude && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" 
              title="View on Map"
              onClick={() => onViewOnMap(alert)} // ✅ Calls navigate function
            >
              <Pin className="h-4 w-4" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(alert)}>
                View Details
              </DropdownMenuItem>
              {alert.latitude && alert.longitude && (
                <DropdownMenuItem onClick={() => onViewOnMap(alert)}>
                  View on Map
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onAssign(alert, null, null)}>
                Assign Responder
              </DropdownMenuItem>
              {alert.status !== 'resolved' && (
                <DropdownMenuItem onClick={() => onStatusChange(alert, 'resolved')}>
                  Mark as Resolved
                </DropdownMenuItem>
              )}
              {alert.status !== 'cancelled' && (
                <DropdownMenuItem onClick={() => onStatusChange(alert, 'cancelled')}>
                  Cancel Alert
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDelete(alert)}
              >
                Delete Alert
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
