'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "./use-toast";
import { AccountSchemaType, UpdateAccountSchemaType, UpdateCertificateSchemaType } from "@/lib/zod-schema";
import { useRouter } from "next/navigation";

//LIST OF TABLES

export const getDivisionTable = () => useQuery({
    queryKey: ['divisionOfficeData'],
    queryFn: async () => {
        const res = await axios.get(`/api/do_table`)
        return res.data
    }
})

export const getSchoolTable = () => useQuery({
    queryKey: ['schoolData'],
    queryFn: async () => {
        const res = await axios.get(`/api/school_table`)
        return res.data
    }
})

export const suspendDivisionUser = (id:string | string[]) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['suspendUser',id],
        mutationFn: async (reason: string) => {
            const res = await axios.patch(`/api/suspend-user/${id}`,  { 
                status: reason 
              })
        },
        onError: (error: any) => {
            console.error(error)
            toast({
                title: error.response?.data?.message || "An error occurred"
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['divisionOfficeData', id]
            });
            toast({
                title: "User credential has been updated!"
            })
        }
    })
}


//ADMIN SIDE CALLS


//UPDATE CREDENTIALS

export const getCurrentCredentials = (id: string | string[]) => useQuery({
    queryKey: ['userCredentials', id],
    queryFn: async () => {
        const res = await axios.get(`/api/user-credentials/getUserCredentials/${id}`)
        return res.data
    }

})

export const updateCurrentCredential = (id: string | string[]) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['updateCredentials', id],
        mutationFn: async (values: any) => {
            const res = await axios.patch(`/api/user-credentials/updateUserCredentials/${id}`, values)
        },
        onError: (error: any) => {
            console.error(error)
            toast({
                title: error.response?.data?.message || "An error occurred"
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['userCredentials', id]
            });
            toast({
                title: "User credential has been updated!"
            })
        }
    })

}

//UPDATE ACCOUNTS
export const updateAccount = (id: string | string[]) => {
    const queryClient = useQueryClient()
    const router = useRouter()
    return useMutation({
        mutationKey: ['updateAccounts', id],
        mutationFn: async (values: UpdateAccountSchemaType) => {
            await axios.patch(`/api/user-credentials/updateUserAccount/${id}`, values)
        },
        onError: (error) => {
            toast({
                title: "Failed to update account"
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['accountDetails', id]
            });
            toast({
                title: "User account has been updated!"
            })
        }

    })
}

export const getAccountDetails = (id: string | string[]) => useQuery({
    queryKey: ['accountDetails', id],
    queryFn: async () => {
        const res = await axios.get(`/api/user-credentials/getUserAccount/${id}`)
        return res.data
    }
})






//###############################################################
//CLIENT SIDE CALLS

//ACCOUNTS
//FETCH
export const getSingleAccount = (id: string | string[]) => useQuery({
    queryKey: ['userAccount', id],
    queryFn: async () => {
        const res = await axios.get(`/api/account/${id}`)
        return res.data
    }
})

//UPDATE

export const updateSingleAccount = (id: string | string[]) => {
    const queryClient = useQueryClient()
    const router = useRouter()
    return useMutation({
        mutationKey: ['updateAccount'],
        mutationFn: async (values: AccountSchemaType) => {
            await axios.patch(`/api/updateAccount/${id}`, values)
        },
        onSuccess: () => {
            toast({
                title: 'Successfully updated account'
            })
            queryClient.invalidateQueries({
                queryKey: ['userAccount', id]
            });
            router.push('/')

        },
        onError: (error) => {
            toast({
                title: "Error occurred",
                description: error.message
            })
        },
    })
}


//CERTIFICATES
//GET HOOKS 

export const getCertificateTable = (id: string | string[]) => useQuery({
    queryKey: ['certificateTable'],
    queryFn: async () => {
        const res = await axios.get(`/api/certificates/table/${id}`)
        return res.data
    }
})

export const getSingleCertificate = (id: string) => useQuery({
    queryKey: ['singleCertificate', id],
    queryFn: async () => {
        const res = await axios.get(`/api/certificates/getSingleCertificate/${id}`)
        return res.data
    },

})

export const useUpdateSingleCertificateMutation = (id: string) => {
    const queryClient = useQueryClient()
    const router = useRouter()
    return useMutation({
        mutationKey: ['updateSingleCertificate', id],
        mutationFn: async (values: UpdateCertificateSchemaType) => {
            const res = await axios.patch(`/api/certificates/updateSingleCertificate/${id}`, values)
            return res.data
        },
        onError: (error) => {
            toast({
                title: "Error occurred",
                description: error.message
            })
        },
        onSuccess: () => {
            toast({
                title: "Successfully Updated User."
            })
            queryClient.invalidateQueries({
                queryKey: ['singleCertificate', id]
            });
            router.push('/')
        }
    })
}

export const deleteCertificate = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['deleteCertificate'],
        mutationFn: async (id: string) => {
            await axios.delete(`/api/certificates/deleteCertificate/${id}`)
        },
        onError: (error) => {
            console.error("Full mutation error:", error)
            toast({
                title: "Error occurred",
                description: error.message
            })
        },
        onSuccess: () => {
            toast({
                title: "Successfully Deleted User."
            })
            queryClient.invalidateQueries({
                queryKey: ['certificateTable']
            });
        },
    })
}