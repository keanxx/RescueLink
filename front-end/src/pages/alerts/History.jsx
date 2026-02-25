import AlertsTable from '@/features/alerts/alerts-table'
import React from 'react'

const History = () => {
  return (
    <div><AlertsTable statusFilter={["resolved", "cancelled", "deleted"]} /></div>
  )
}

export default History