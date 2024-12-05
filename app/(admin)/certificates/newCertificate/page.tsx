'use client'
import { CertificateSchema, CertificateSchemaType, CreateRoleAccountSchema } from '@/lib/zod-schema'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { school_hours, school_years_in_service } from '@/lib/school-choices'
import { NewCertificateAction } from '@/app/actions/newCertificate'
import { toast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

const NewCertificate = () => {
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState()
  const router = useRouter()

  const form = useForm<CertificateSchemaType>({
    resolver: zodResolver(CertificateSchema),
    defaultValues: {
      training_title: '',
      training_year: '',
      training_from: '',
      training_to: '',
      training_number_of_hours: '',
      training_sponsored_by: '',
      training_name_of_provider: '',
      training_category: '',
      training_internation: '',
    }
  })



  const { mutate, isPending } = useMutation({
    mutationKey: ['newCertificate'],
    mutationFn: NewCertificateAction,
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
    }
  })

  function handleOnChange(){
    
  }

  const onSubmit = useCallback((values: CertificateSchemaType) => {
    console.log(values)
    mutate(values)
  },[mutate])


  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add new certificate</CardTitle>
          <CardDescription>Create a new certificate for your L&D interventions / training programs</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name="training_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TITLE OF L&D INTERVENTIONS / TRAINING PROGRAMS ATTENDED</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter training title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name="training_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YEAR</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                          <SelectItem value="2021">2021</SelectItem>
                          <SelectItem value="2020">2020</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-2 border rounded-md overflow-hidden">
                  <div className="bg-muted px-4 py-2 font-medium text-sm">
                    INCLUSIVE DATES OF ATTENDANCE (dd/mm/yyyy)
                  </div>
                  <div className="flex">
                    <FormField
                      control={form.control}
                      name="training_from"
                      render={({ field }) => (
                        <FormItem className="flex-1 px-4 py-2 border-r">
                          <FormLabel className="text-xs uppercase">From</FormLabel>
                          <FormControl>
                            <Input type="date" placeholder="dd/mm/yyyy" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="training_to"
                      render={({ field }) => (
                        <FormItem className="flex-1 px-4 py-2">
                          <FormLabel className="text-xs uppercase">To</FormLabel>
                          <FormControl>
                            <Input type="date" placeholder="dd/mm/yyyy" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <FormField
                control={form.control}
                name="training_number_of_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of years" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <>
                          {school_hours.map((time) => (
                            <SelectItem key={time.id} value={time.value}>{time.value}</SelectItem>

                          ))}
                        </>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="training_sponsored_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CONDUCTED / SPONSORED BY</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter sponsor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="training_name_of_provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NAME OF PROVIDER</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter provider name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="training_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CATEGORY</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="managerial">Managerial</SelectItem>
                        <SelectItem value="supervisory">Supervisory</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="training_internation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>INTERNATIONAL</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select yes or no" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="training_certificate"
                render={({ fie       x`xld }) => (
                  <FormItem>
                    <FormLabel>CERTIFICATE (File Upload)</FormLabel>
                    <FormControl>
                    <Input type="file" placeholder="shadcn" {...fileRef} />

                    </FormControl>
                    <FormDescription>Upload your certificate file (PDF, JPG, PNG)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <Button 
                disabled={isPending}
              type="submit">
                {isPending ? 'Submitting' : 'Submited'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewCertificate