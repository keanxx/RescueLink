import AlertsTable from '@/features/alerts/alerts-table'
import React from 'react'

const Alerts = () => {
  return (
    <div className='space-y-6'>

    <AlertsTable statusFilter={["pending", "responding"]} />
    </div>
  )
}

export default Alerts