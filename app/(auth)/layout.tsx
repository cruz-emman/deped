import React from 'react'

const AuthorizeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-dvh flex items-center justify-center'>
      <div className='p-4 shadow-md'>
        {children}
      </div>
    </div>
  )
}

export default AuthorizeLayout