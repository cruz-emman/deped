'use client'
import { useSession } from "next-auth/react";


export const useCurrentSessionId = () => {
    const session = useSession()

    
    return session.data?.user.id
}