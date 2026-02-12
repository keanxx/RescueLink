import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

export const createColumns = (onEdit, onDelete) => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "first_name",
    header: "Name",
    cell: ({ row }) => {
      const firstName = row.getValue("first_name");
      const lastName = row.original.last_name;
      const middleName = row.original.middle_name;
      const extName = row.original.ext_name;
      
      return (
        <div>
          <div className="font-medium">
            {firstName} {middleName ? middleName.charAt(0) + '.' : ''} {lastName} {extName || ''}
          </div>
          <div className="text-xs text-gray-500">@{row.original.username}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "user_phone_number",
    header: "Contact",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role");
      const roleColors = {
        admin: "bg-red-100 text-red-800",
        driver: "bg-blue-100 text-blue-800",
        rescuer: "bg-green-100 text-green-800",
        dispatcher: "bg-yellow-100 text-yellow-800",
        user: "bg-gray-100 text-gray-800",
      };
      
      return (
        <Badge className={roleColors[role] || roleColors.user}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(user)}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(user)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
