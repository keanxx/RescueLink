import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, CheckCircle, Pin, MoreHorizontal } from "lucide-react";

export const columns = [
  {
    accessorKey: "id",
    header: "ALERT ID",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-sm">{row.original.id}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.timestamp}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "user",
    header: "USER / DEVICE",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-sm">{row.original.user}</div>
        
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "LOCATION",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.location.lat}, {row.original.location.lng}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status;
      const variantMap = {
        Pending: "bg-orange-100 text-orange-700",
        Verified: "bg-green-100 text-green-700",
        Resolved: "bg-blue-100 text-blue-700",
      };
      return (
        <Badge className={`font-medium ${variantMap[status]}`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "alertType",
    header: "ALERT TYPE",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.alertType}</span>
    ),
  },
  {
    accessorKey: "severity",
    header: "SEVERITY",
    cell: ({ row }) => {
      const severity = row.original.severity;
      const variantMap = {
        Critical: "destructive",
        High: "default",
        Medium: "secondary",
      };
      return (
        <Badge variant={variantMap[severity]} className="font-medium">
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
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>

          {alert.status === "Pending" && (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pin className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete Alert
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
