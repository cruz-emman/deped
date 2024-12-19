'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { useCurrentRole } from '@/hooks/user-role'
import { CreateRoleAccountSchema, CreateRoleAccountSchemaType, UpdateRoleAccountSchema, UpdateRoleAccountSchemaType } from '@/lib/zod-schema'
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
import AccountDetails from './_components/AccountDetails'
import { getCurrentCredentials, updateCurrentCredential } from '@/hooks/react-query-hooks'

const EditUser = () => {

  const role = useCurrentRole()
  const { id } = useParams()
  const queryClient = useQueryClient()


  const [forcePassword, setForcePassword] = useState(true)


  const credentialForm = useForm<any>({
  })


  //Fetch the credentials data, user itself
  const getUserCredentials = getCurrentCredentials(id)
  const updateCredential = updateCurrentCredential(id)

  const affiliationUser = credentialForm.watch('affiliation')

  const handleSubmitCredential = useCallback((value: any) => {
    updateCredential.mutate(value); // This will trigger the mutation to update credentials
  }, [updateCredential]
  )



  useEffect(() => {
    if (getUserCredentials.data) {
      credentialForm.reset({
        name: getUserCredentials.data.name || "",
        email: getUserCredentials.data.email,
        role: getUserCredentials.data.role,
        affiliation: getUserCredentials.data.affiliation
      })
    }
  }, [getUserCredentials.data, credentialForm.reset])

  //END OF CREDENTIAL VALUES




  return (
    <div className='max-w-screen-2xl w-full mx-auto relative'>
      <div className='grid grid-cols-1 gap-4 pb'>
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
                          defaultValue={getUserCredentials.data?.name || ""}
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
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password*</FormLabel>
                              <FormControl>
                                <Input disabled={forcePassword} type='password' placeholder="password" {...field} />
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
                                  {role === 'school_admin' && (
                                    <>
                                      <SelectItem value="teacher">Teacher</SelectItem>

                                    </>
                                  )}


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
        <AccountDetails affiliationOfUser={affiliationUser} />
      </div>
    </div>
  )
}

export default EditUser