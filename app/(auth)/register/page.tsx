'use client'
import React, { useCallback } from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RegisterSchema, RegisterSchemaType } from '@/lib/zod-schema'
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { RegisterAccountAction } from '../../actions/register'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

const RegisterForm = () => {

  const router = useRouter()

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: ''
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: RegisterAccountAction,
    onSuccess: () => {
      toast({
        title: "Successfully register account"
      })
      router.push('/login')
    },
    onError: () => {
      toast({
        title: "Unable to register account"
      })
    }
  })



  const onSubmit = useCallback((values: RegisterSchemaType) => {
    mutate(values)
  }, [mutate])


  return (
    <div className='flex items-center justify-center flex-col gap-4'>
      <Image
        src="/images/logo.png"
        alt="logo"
        width={100}
        height={100}
      />
      <p className='text-2xl text-muted-foreground'>Register</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input type='email' placeholder="email" {...field} />
                </FormControl>
                {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder="password" {...field} />
                </FormControl>
                {form.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
              </FormItem>
            )}
          />
          <p className='text-sm text-muted-foreground'>Don't have an account? email at <span className='text-blue-400 underline'>admin@email.com</span></p>

          <Button
            disabled={isPending}
            type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default RegisterForm