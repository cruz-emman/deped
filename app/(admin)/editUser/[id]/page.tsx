'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { useCurrentRole } from '@/hooks/user-role'
import { CreateRoleAccountSchema, CreateRoleAccountSchemaType } from '@/lib/zod-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectValue } from '@radix-ui/react-select'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import SkeletonWrapper from '@/components/skeleton-wrapper'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

const EditUser = () => {

  const role = useCurrentRole()
  const { id } = useParams()
  const queryClient = useQueryClient()


  const [forcePassword, setForcePassword] = useState(true)


  const credentialForm = useForm<CreateRoleAccountSchemaType>({
    resolver: zodResolver(CreateRoleAccountSchema)
  })


  //Fetch the credentials data, user itself
  const getUserCredentials = useQuery({
    queryKey: ['userCredentials', id],
    queryFn: async () => {
      const response = await axios.get(`/api/user-credentials/getUserCredentials/${id}`)
      if (!response.data) {
        throw new Error('No user credentials found')
      }
      return response.data
    }
  })



  const updateCredential = useMutation({
    mutationKey: ['updateCredentials', id],
    mutationFn: async (values: CreateRoleAccountSchemaType) => {
      const res = await fetch(`/api/user-credentials/updateUserCredentials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server response error:", errorText);
        throw new Error("Failed to update account");
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to update credentials"
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


  const handleSubmitCredential = useCallback((value: CreateRoleAccountSchemaType) => {
    updateCredential.mutate(value); // This will trigger the mutation to update credentials
  }, [updateCredential]
  )



  useEffect(() => {
    if (getUserCredentials.data) {
      credentialForm.reset({
        name: getUserCredentials.data.name,
        email: getUserCredentials.data.email,
        role: getUserCredentials.data.role,
        affiliation: getUserCredentials.data.affiliation
      })
    }
  }, [getUserCredentials.data, credentialForm.reset])

  //END OF CREDENTIAL VALUES

  const accountForm = useForm({
    defaultValues: {

    }
  })





  return (
    <div className='max-w-screen-2xl w-full mx-auto relative'>
      <div className='grid grid-cols-1 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Credentials/Login Details</CardTitle>
            <CardDescription>This part is where you edit the credential details such as email, password, role and affiliation</CardDescription>
          </CardHeader>
          <CardContent>
            <SkeletonWrapper isLoading={getUserCredentials.isLoading}>
              <Form {...credentialForm}>
                <form onSubmit={credentialForm.handleSubmit(handleSubmitCredential)} className="space-y-8">
                  <div className='flex flex-col items-start justify-center gap-2'>
                    <p className='text-muted-foreground font-semibold pb-2'>Login Details</p>
                    <div className='w-full gap-4 grid grid-cols-1 md:grid-cols-2'>
                      {/* Name(username), Email, Password, Role */}
                      <div className=''>
                        <FormField
                          control={credentialForm.control}
                          defaultValue={getUserCredentials.data?.name}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username*</FormLabel>
                              <FormControl>
                                <Input type="text" placeholder="Username" {...field} />
                              </FormControl>

                            </FormItem>
                          )}
                        />
                        <FormField
                          control={credentialForm.control}
                          name="password"
                          defaultValue={getUserCredentials.data?.password}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password*</FormLabel>
                              <FormControl>
                                <Input disabled={forcePassword} type='text' placeholder="password" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center pt-1 space-x-2">
                          <Switch id="force-change" onClick={(e) => setForcePassword((prev) => !prev)} />
                          <Label htmlFor="force-change">Force Change </Label>
                        </div>

                        <FormField
                          control={credentialForm.control}
                          name="email"
                          defaultValue={getUserCredentials.data?.email}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email*</FormLabel>
                              <FormControl>
                                <Input type='email' placeholder="Email" {...field} />
                              </FormControl>

                            </FormItem>
                          )}
                        />
                      </div>

                      <div>
                        <FormField
                          control={credentialForm.control}
                          name="role"
                          defaultValue={getUserCredentials.data?.role}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role*</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {role === 'super_admin' && (
                                    <>
                                      <SelectItem value="division_office_admin">Division Office Admin</SelectItem>
                                      <SelectItem value="school_admin">School Admin</SelectItem>
                                    </>
                                  )}
                                  {role === 'division_office_admin' && (
                                    <>
                                      <SelectItem value="division_office">Division Office</SelectItem>
                                      <SelectItem value="teacher">Teacher</SelectItem>

                                    </>
                                  )}

                                  {/* {role === 'school_admin' && (

                                  )} */}


                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={credentialForm.control}
                          name="affiliation"
                          defaultValue={getUserCredentials.data?.affiliation}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Affiliation*</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {credentialForm.watch('role') === 'division_office_admin' && (
                                    <SelectItem value="division_office">Division Office Admin</SelectItem>
                                  )}
                                  {credentialForm.watch('role') === 'school_admin' && (
                                    <SelectItem value="school">School</SelectItem>
                                  )}

                                  {role === 'division_office_admin' && (
                                    <>
                                      <SelectItem value="division_office">Divison Office</SelectItem>
                                      <SelectItem value="school">School</SelectItem>
                                    </>
                                  )}
                                  {role === 'school_admin' && (
                                    <SelectItem value="school">School</SelectItem>
                                  )}


                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    disabled={updateCredential.isPending}
                    type='submit'>
                    {updateCredential.isPending ? 'Updating...' : 'Update'}
                  </Button>
                </form>
              </Form>
            </SkeletonWrapper>
          </CardContent>
        </Card>


        {/* Personalize data */}

        <Card>
          <CardHeader>
            <CardTitle>Account/Personal Details</CardTitle>
            <CardDescription>This part is where you edit the personal details such as first name, middle name, last name, position, classification, section/unit, etc...</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...credentialForm}>
              <form className="space-y-8">
                Personal Details
              </form>
            </Form>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default EditUser