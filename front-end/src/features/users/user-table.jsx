import { useState, useEffect } from "react";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";
import AddEdit from "./add-edit";
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
import { usersAPI } from "@/api/users";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load',
        text: error || 'Could not fetch users',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleDeleteConfirm = async () => {
    try {
      await usersAPI.delete(deleteUser.id);
      
      setUsers(users.filter(u => u.id !== deleteUser.id));
      setDeleteUser(null);

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'User has been deleted successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: error || 'Could not delete user',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  const handleSave = async (userData) => {
    try {
      if (selectedUser) {
        // Update existing user
        const updated = await usersAPI.update(selectedUser.id, userData);
        setUsers(users.map(u => u.id === updated.id ? updated : u));
        
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'User updated successfully',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // Create new user
        const newUser = await usersAPI.create(userData);
        setUsers([...users, newUser]);
        
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: 'User added successfully',
          timer: 1500,
          showConfirmButton: false,
        });
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: error || 'Could not save user',
        confirmButtonColor: '#dc2626',
        backdrop: false, // Disable Swal's own backdrop
  customClass: {
    container: 'swal-no-backdrop'
  }
      });
    }
  };

  const columns = createColumns(handleEdit, handleDelete);
  
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
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage drivers, responders, and administrators</p>
        </div>
        <Button onClick={handleAdd} className="text-white bg-red-600 hover:bg-red-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
    
      <DataTable columns={columns} data={users} />
      
      <AddEdit
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        user={selectedUser}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteUser?.first_name} {deleteUser?.last_name}</strong> ({deleteUser?.email}).
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
