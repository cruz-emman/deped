'use client' 
import { signOut } from "next-auth/react"
import { Button } from '@/components/ui/button'
import React from 'react'
import { LogOut } from "lucide-react"

const SignOutButton = () => {
  return (
    <Button
        onClick={() => signOut()} 
        variant="outline">
        <LogOut /> Sign out
    </Button>
  )
}

export default SignOutButton