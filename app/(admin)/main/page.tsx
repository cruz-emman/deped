'use client'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useCurrentUser } from '@/hooks/user-current'
import Image from 'next/image'
import React from 'react'

const Main = () => {
  const user = useCurrentUser()

  return (

    <>
      <Card className='relative z-10'>
        <CardHeader>
          <CardTitle>Welcome! Please on the sidebar, click Accounts to edit your information, Thank you!</CardTitle>
        </CardHeader>
      </Card>
      <div className='relative w-full h-screen flex items-center justify-center'>
        {/* Background Image with Reduced Opacity and Centered */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <Image
            className='opacity-30 pointer-events-none'
            src="/images/logo.png"
            alt='Logo'
            width={650}
            height={650}
            quality={100}
          />
        </div>

        {/* Card Overlay */}

      </div>
    </>

  )
}

export default Main