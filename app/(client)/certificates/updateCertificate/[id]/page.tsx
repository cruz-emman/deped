'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { school_hours } from '@/lib/school-choices'
import { getSingleCertificate, useUpdateSingleCertificateMutation } from '@/hooks/react-query-hooks'
import { useParams } from 'next/navigation'
import SkeletonWrapper from '@/components/skeleton-wrapper'
import { UpdateCertificateSchema, UpdateCertificateSchemaType } from '@/lib/zod-schema'
import { zodResolver } from '@hookform/resolvers/zod'

const UpdateCertificate = () => {
  const { id } = useParams<{ id: string }>();
  const {data: singleCertificate, isLoading: singleCertificateIsLoading} = getSingleCertificate(id)

  const UpdateCertificate = useUpdateSingleCertificateMutation(id)


  const form = useForm<UpdateCertificateSchemaType>({
    resolver: zodResolver(UpdateCertificateSchema),
  })
  
  useEffect(() => {
    if(singleCertificate){
      form.reset({
        training_title: singleCertificate.training_title,
        training_year: singleCertificate.training_year,
        training_from: singleCertificate.training_from,
        training_to: singleCertificate.training_to,
        training_number_of_hours: singleCertificate.training_number_of_hours,
        training_sponsored_by: singleCertificate.training_sponsored_by,
        training_name_of_provider: singleCertificate.training_name_of_provider,
        training_category: singleCertificate.training_category,
        training_international: singleCertificate.training_international,

      })
    }
  }, [singleCertificate, form.reset])


  const onSubmit = useCallback((values: UpdateCertificateSchemaType) => {
    UpdateCertificate.mutate(values)
  }, [UpdateCertificate])
  


  return (
    <div className='max-w-screen-2xl mx-auto w-full'>
      <Card>
        <CardHeader>
          <CardTitle>Update Certificate</CardTitle>
          <CardDescription>Update your personal certificate</CardDescription>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={singleCertificateIsLoading}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name="training_title"
                defaultValue={singleCertificate?.training_title}
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
                  defaultValue={singleCertificate?.training_year}
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
                      defaultValue={singleCertificate?.training_from}

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
                      defaultValue={singleCertificate?.training_to}

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
                defaultValue={singleCertificate?.training_number_of_hours}

                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. of Years</FormLabel>
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
                defaultValue={singleCertificate?.training_sponsored_by}

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
                defaultValue={singleCertificate?.training_name_of_provider}

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
              <FormField
                control={form.control}
                name="training_category"
                defaultValue={singleCertificate?.training_category}

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
                        <SelectItem value="learning area">Learning Area</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="training_international"
                defaultValue={singleCertificate?.training_international}

                render={({ field }) => (
                  <FormItem>
                    <FormLabel>INTERNATIONAL / LOCAL</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select International or Local" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="international">International</SelectItem>
                        <SelectItem value="local">Local</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
           
              <Button
                // disabled={isPending}
                type="submit">
                {/* {isPending ? 'Submitting' : 'Submited'} */}
                Submit
              </Button>
            </form>
          </Form>
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  )
}

export default UpdateCertificate