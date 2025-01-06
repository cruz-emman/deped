'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"

import React, { useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CreateRoleAccountSchema, CreateRoleAccountSchemaType } from '@/lib/zod-schema'
import { CreateAccountActionRole } from '@/app/actions/createAccountRole'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useCurrentRole } from '@/hooks/user-role'

const NewUser = () => {
    const router = useRouter()
    const role = useCurrentRole()
    const form = useForm<CreateRoleAccountSchemaType>({
        resolver: zodResolver(CreateRoleAccountSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: undefined, 
            affiliation: undefined,
            first_name: '',
            middle_name: '',
            last_name: ''
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: CreateAccountActionRole,
        onSuccess: (data) => {
            if (data?.success) {
                toast({
                    title: "Success",
                    description: data.success,
                    variant: "default"
                })
                // Optionally reset form or redirect
                router.push('/accounts')
            }
            if (data?.error) {
                toast({
                    title: "Error",
                    description: data.error,
                    variant: "destructive"
                })
            }
        },
        onError: (error: Error) => {
            console.error("Client error:", error)
            toast({
                title: "Error",
                description: "Unable to create a new account. Please try again.",
                variant: "destructive"
            })
        }
    })

    const onSubmit = useCallback((values: CreateRoleAccountSchemaType) => {
        mutate(values)
    }, [mutate])
    return (
        <Card className='mt-2'>
            <CardHeader>
                <CardTitle>
                    Add New User
                </CardTitle>
                <CardDescription>
                    Manually add a user and their personal information.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8' >
                        <div className='flex flex-col items-start justify-center gap-2'>
                            <p className='text-muted-foreground font-semibold pb-2'>Login Details</p>
                            <div className='w-full gap-4 grid grid-cols-1 md:grid-cols-2'>
                                {/* Name(username), Email, Password, Role */}
                                <div className=''>
                                <FormField
                                        control={form.control}
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
                                        control={form.control}
                                        name="first_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name*</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="First Name" {...field} />
                                                </FormControl>

                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="middle_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Middle Name*</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Middle Name" {...field} />
                                                </FormControl>

                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="last_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name*</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Last Name" {...field} />
                                                </FormControl>

                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password*</FormLabel>
                                                <FormControl>
                                                    <Input type='password' placeholder="password" {...field} />
                                                </FormControl>

                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
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
                                        control={form.control}
                                        name="role"
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
                                                            </>
                                                        )}

                                                        {role === 'school_admin' && (
                                                            <SelectItem value="teacher">Teacher</SelectItem>

                                                        )}


                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="affiliation"
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
                                                        {form.watch('role') === 'division_office_admin' && (
                                                            <SelectItem value="division_office">Division Office Admin</SelectItem>
                                                        )}
                                                        {form.watch('role') === 'school_admin' && (
                                                            <SelectItem value="school">School</SelectItem>
                                                        )}

                                                        {role === 'division_office_admin' && (
                                                            <SelectItem value="division_office">Divison Office</SelectItem>
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
                            type='submit'
                            disabled={isPending}
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default NewUser