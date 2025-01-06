'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import React, { useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateUserCredentialSchema, UpdateUserCredentialSchemaType } from '@/lib/zod-schema'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SkeletonWrapper from '@/components/skeleton-wrapper'
import { toast } from '@/hooks/use-toast'

const UserCredentials = () => {
  const { id } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['mycredential', id],
    queryFn: async () => {
      const res = await axios.get(`/api/client/client-credential/${id}`)
      return res.data
    }
  })

  const form = useForm<UpdateUserCredentialSchemaType>({
    resolver: zodResolver(UpdateUserCredentialSchema)
  })

  const updateUser = useMutation({
    mutationKey: ['updateMyCredential', id],
    mutationFn: async (value: UpdateUserCredentialSchemaType) => {
      await axios.patch(`/api/client/client-credential-update/${id}`, value)
    },
    onSuccess: () => {
      toast({
        title: "Successfully Updated"
      })
      queryClient.invalidateQueries({
        queryKey: ['updateMyCredential', id]
      });
      window.location.reload()
      router.push('/')
    },
    onError: (error) => {
      toast({
        title: "Error"
      })
      console.log(error)
    }
  })


  const onSubmit = useCallback((value: UpdateUserCredentialSchemaType) => {
    // Pass the form values directly to mutate
    updateUser.mutate(value)
  }, [updateUser])


  return (
    <div className='min-h-screen p-4 bg-gray-50 '>
      <SkeletonWrapper isLoading={isLoading}>
        <Card className='max-w-screen-2xl mx-auto'>
          <CardHeader>
            <CardTitle>Login Details / Your Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-4'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                  <FormField
                    control={form.control}
                    name="email"
                    defaultValue={data?.email
                      
                    }
                    disabled={true}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type='email' placeholder="email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type='password' placeholder="password" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    disabled={updateUser.isPending}
                    type="submit"
                  >
                    {updateUser.isPending ? 'Updating...' : "Update"}
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </SkeletonWrapper>
    </div>
  )
}

export default UserCredentials