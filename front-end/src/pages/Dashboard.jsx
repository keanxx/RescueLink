import React from 'react';
import { StatCard } from '@/components/StatCard';
import { AlertTriangle, Users, Car, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import LiveAlertsTable from '@/features/dashboard/live-alerts/live-alerts-table';
import MapView from '@/features/dashboard/live-map/map-view';
import AccidentMap from '@/features/dashboard/live-map/map-view';

// Sample alerts data (you can move this to a shared file later)
const alerts = [];

const Dashboard = () => {
 <div>
  Empty for now, testing geoglocation atm, cannot test geo tagging in localhost, will test in production. Will work on the dashboard later.
 </div>
};

export default Dashboard;
