'use client'

import React from 'react'
import TodoDetails from '../../../components/TodoDetails'
import ProtectedRoute from '../../../components/ProtectedRoute'

export default function TodoDetailsPage() {
  return (
    <ProtectedRoute>
      <TodoDetails />
    </ProtectedRoute>
  )
}


