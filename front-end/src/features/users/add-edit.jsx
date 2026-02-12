import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AddEdit({ open, onOpenChange, user, onSave }) {
  const isEdit = !!user;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    ext_name: '',
    username: '',
    email: '',
    password: '',
    user_phone_number: '',
    role: '',
  });

  useEffect(() => {
    if (user) {
      // Edit mode - pre-fill data (no password)
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        middle_name: user.middle_name || '',
        ext_name: user.ext_name || '',
        username: user.username || '',
        email: user.email || '',
        password: '', // Don't pre-fill password
        user_phone_number: user.user_phone_number || '',
        role: user.role || '',
      });
    } else {
      // Add mode - reset form
      setFormData({
        first_name: '',
        last_name: '',
        middle_name: '',
        ext_name: '',
        username: '',
        email: '',
        password: '',
        user_phone_number: '',
        role: '',
      });
    }
  }, [user, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Clean up data
      const cleanedData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        middle_name: formData.middle_name?.trim() || null,
        ext_name: formData.ext_name?.trim() || null,
        username: formData.username.trim(),
        email: formData.email.trim(),
        user_phone_number: formData.user_phone_number.trim(),
        role: formData.role,
      };

      // Add password only if provided (for create or update)
      if (!isEdit) {
        // Creating new user - password required
        if (!formData.password) {
          alert('Password is required for new users');
          setLoading(false);
          return;
        }
        cleanedData.password = formData.password;
      } else if (formData.password) {
        // Editing and password provided - update password
        cleanedData.password = formData.password;
      }

      console.log('Sending data:', cleanedData);
      await onSave(cleanedData);
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name and Last Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className='space-y-2'>
              <Label>First Name *</Label>
              <Input
                className="focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="John"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label>Last Name *</Label>
              <Input
                className="focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="Doe"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Middle Name and Extension Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className='space-y-2'>
              <Label>Middle Name</Label>
              <Input
                className="focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="Smith (optional)"
                value={formData.middle_name}
                onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className='space-y-2'>
              <Label>Extension</Label>
              <Input
                className="focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="Jr., Sr. (optional)"
                value={formData.ext_name}
                onChange={(e) => setFormData({ ...formData, ext_name: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {/* Username */}
          <div className='space-y-2'>
            <Label>Username *</Label>
            <Input
              className="focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="johndoe"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          {/* Email */}
          <div className='space-y-2'>
            <Label>Email *</Label>
            <Input
              type="email"
              className="focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          {/* Password */}
          <div className='space-y-2'>
            <Label>Password {!isEdit && '*'}</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                className="focus:ring-2 focus:ring-red-500 focus:outline-none pr-10"
                placeholder={isEdit ? "Leave blank to keep current" : "Enter password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
                required={!isEdit}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {isEdit && (
              <p className="text-xs text-gray-500">
                Leave blank to keep current password
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className='space-y-2'>
            <Label>Contact Number *</Label>
            <Input
              type="tel"
              className="focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="09123456789"
              value={formData.user_phone_number}
              onChange={(e) => setFormData({ ...formData, user_phone_number: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          {/* Role */}
          <div className='space-y-2'>
            <Label>Role *</Label>
            <Select 
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="rescuer">Rescuer</SelectItem>
                  <SelectItem value="dispatcher">Dispatcher</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                isEdit ? 'Save Changes' : 'Add User'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
