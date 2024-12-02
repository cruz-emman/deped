import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Certificates = () => {
  return (
    <div>
        <Button asChild>
            <Link href={`/certificates/newCertificate`}>
            Add Certificate
            </Link>
        </Button>
    </div>
  )
}

export default Certificates