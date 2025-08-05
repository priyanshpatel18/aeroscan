'use client'

import { ClusterProvider } from '@/components/Providers/ClusterProvider'
import { ReactQueryProvider } from '@/components/Providers/ReactQueryProvider'
import { SolanaProvider } from '@/components/Providers/SolanaProvider'
import { ReactNode } from 'react'

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ReactQueryProvider>
      <ClusterProvider>
        <SolanaProvider>{children}</SolanaProvider>
      </ClusterProvider>
    </ReactQueryProvider>
  )
}