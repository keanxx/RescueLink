import { useState } from "react";
import { DataTable } from "./data-table";
import { createColumns } from "./columns"; // Import the function
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";
import AddEdit from "./add-edit";
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

export default function UserTable() {
  const [users, setUsers] = useState([
    // Add some sample data to test
    {
      id: 1,
      name: "Juan Dela Cruz",
      email: "juan@example.com",
      role: "Admin",
      contact: "+63 912 345 6789",
      status: "Verified"
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@example.com",
      role: "Rescuer",
      contact: "+63 923 456 7890",
      status: "Verified"
    }
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user) => {
    setDeleteUser(user);
  };

  const handleDeleteConfirm = () => {
    setUsers(users.filter(u => u.id !== deleteUser.id));
    setDeleteUser(null);
  };

  const handleSave = (userData) => {
    if (selectedUser) {
      // Edit existing user
      setUsers(users.map(u => u.id === userData.id ? userData : u));
    } else {
      // Add new user
      setUsers([...users, userData]);
    }
  };

  // Create columns with handlers
  const columns = createColumns(handleEdit, handleDelete);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage drivers, responders, and administrators</p>
        </div>
        <Button onClick={handleAdd} className={"text-white bg-red-600 hover:bg-red-700"}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <DataTable columns={columns} data={users} />
      
      {/* Add/Edit Modal */}
      <AddEdit
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        user={selectedUser}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteUser?.name}</strong> ({deleteUser?.email}).
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
