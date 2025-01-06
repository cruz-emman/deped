'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

const queryClient = new QueryClient({})

export const Providers = ({
  children,
  session,
}:{
  //@ts-ignore
  children: any
  session: Session | null;
}) => (
    <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
    </SessionProvider>
);