'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getDefaultOrgIdAction } from '@/app/actions/org'

type OrgContextValue = {
  orgId: string | null
  loading: boolean
  refresh: () => Promise<void>
}

const OrgContext = createContext<OrgContextValue>({
  orgId: null,
  loading: true,
  refresh: async () => {},
})

export function OrgProvider({ children, initialOrgId }: { children: React.ReactNode; initialOrgId: string | null }) {
  const [orgId, setOrgId] = useState<string | null>(initialOrgId)
  const [loading, setLoading] = useState(!initialOrgId)

  const refresh = useCallback(async () => {
    setLoading(true)
    const id = await getDefaultOrgIdAction()
    setOrgId(id)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!initialOrgId) {
      refresh()
    }
  }, [initialOrgId, refresh])

  return (
    <OrgContext.Provider value={{ orgId, loading: loading && !orgId, refresh }}>
      {children}
    </OrgContext.Provider>
  )
}

export function useOrgId(): string | null {
  return useContext(OrgContext).orgId
}

export function useOrg(): OrgContextValue {
  return useContext(OrgContext)
}
