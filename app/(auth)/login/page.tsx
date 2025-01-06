'use client'
import React, { useCallback } from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginSchema, LoginSchemaType } from '@/lib/zod-schema'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { LoginAccountAction } from '../../actions/login'
import Image from 'next/image'

const LoginForm = () => {

  const router = useRouter()

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ''
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: LoginAccountAction,
    onSuccess: (data) => {
      if (data?.success) {
        toast({
          title: data.success
        })
        window.location.reload()
        router.push('/main')
      }
      else if (data?.error) {
        toast({
          title: data.error
        })
      }
    },
    onError: (error) => {
      toast({
        title: "Unable to login account"
      })
      console.error(error)
    }
  })



  const onSubmit = useCallback((values: LoginSchemaType) => {
    mutate(values)
  }, [mutate])


  return (
<div className='flex items-center justify-center flex-col gap-4 w-[300px] mx-auto'>
<Image
        src="/images/logo.png"
        alt='logo'
        width={100}
        height={100}
      />
      <p className='text-2xl text-muted-foreground'>Login</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-8 w-[300px] max-w-full"

        >
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
                <FormMessage>
                   {form.formState.errors.password.message}
                </FormMessage>
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

export default LoginForm