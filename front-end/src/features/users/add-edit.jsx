// src/features/dashboard/users/user-modal.jsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AddEdit ({ open, onOpenChange, user, onSave }) {
  const isEdit = !!user;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    contact: '',
    status: 'Pending'
  });

  useEffect(() => {
    if (user) {
      // Edit mode - pre-fill data
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
        status: user.status
      });
    } else {
      // Add mode - reset form
      setFormData({
        name: '',
        email: '',
        role: '',
        contact: '',
        status: 'Pending'
      });
    }
  }, [user, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      onSave({ ...user, ...formData }); // Update existing
    } else {
      onSave({ id: Date.now(), ...formData }); // Create new
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='space-y-2'>
            <Label>Full Name</Label>
            <Input
            className={"focus:ring-2 focus:ring-red-500 focus:outline-none"}
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label>Role</Label>
            <Select value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Roles</SelectLabel>
          <SelectItem value="Admin">Admin</SelectItem>
          <SelectItem value="Driver">Driver</SelectItem>
          <SelectItem value="Rescuer">Rescuer</SelectItem>
          <SelectItem value="Dispatcher">Dispatcher</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
          </div>
         
          <div className='space-y-2'>
            <Label>Contact Number</Label>
              <Input
              type="number"
              placeholder="+63 912 345 6789"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required
            />
          </div>

           <div className='space-y-2'>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>


          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Save Changes' : 'Add User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
