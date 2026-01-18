import AlertsTable from '@/features/alerts/alerts-table'
import React from 'react'

const Alerts = () => {
  return (
    <div className='space-y-6'>
        <div>
        <h1 className="text-2xl font-semibold text-gray-900">Alerts Management</h1>
        <p className="text-gray-600 mt-1">Monitor and manage all emergency alerts</p>
    </div>

    <AlertsTable/>
    </div>
  )
}

export default Alerts