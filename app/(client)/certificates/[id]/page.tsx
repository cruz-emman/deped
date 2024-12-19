'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { CertificateTable } from '../_components/CertificateTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useParams } from 'next/navigation'

const Certificates = () => {
    const {id} = useParams()
  
  return (
    <div>
        <Button asChild>
            <Link href={`/certificates/newCertificate`}>
            Add Certificate
            </Link>
        </Button>
        <Card className='mt-10'>
          <CardHeader>
            <CardTitle>
              Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
          <CertificateTable id={id} />
          </CardContent>
        </Card>
    </div>
  )
}

export default Certificates