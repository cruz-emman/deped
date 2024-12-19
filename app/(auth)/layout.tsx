import React from 'react'

const AuthorizeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-dvh flex items-center justify-center'>
      <div className='p-4 shadow-md border-2'>
        {children}
      </div>
    </div>
  )
}

export default AuthorizeLayout