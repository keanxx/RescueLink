import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LoginPage from '@/features/auth/LoginPage';

export default function Login() {


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
     <LoginPage/>
    </div>
  );
}
