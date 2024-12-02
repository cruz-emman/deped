'use client'
import { useCurrentUser } from '@/hooks/user-current'
import React from 'react'

const Main = () => {
  const user = useCurrentUser()
  
  return (
    <div>{`Hello, ${user?.email} to edit your account, click the My Account on sidebar`}</div>
  )
}

export default Main