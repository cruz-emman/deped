'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DivisionTable } from './_components/DivisionTable'
import { SchoolTable } from './_components/SchoolTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useCurrentRole } from '@/hooks/user-role'
import { useCurrentAffiliation } from '@/hooks/user-affiliation'
import { useRouter } from 'next/navigation'

const Accounts = () => {

  const router = useRouter()
  const role = useCurrentRole()
  const affiliation = useCurrentAffiliation()


  return (
    <div className='px-16 space-y-10 '>
      <Button asChild>
        <Link href={'/newUserByAdmin'}>
          Add new user
        </Link>
      </Button>
      {affiliation === 'division_office' && (
        <DivisionTable />
      )}

      {affiliation === 'school' && (
        <SchoolTable />
      )}
    </div>
  )
}

export default Accounts