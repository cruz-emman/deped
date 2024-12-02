'use client'
import { AccountSchema, AccountSchemaType } from '@/lib/zod-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Label } from '@/components/ui/label'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { school_positions, school_years_in_service, schools, schools_classifications } from '@/lib/school-choices'
import { division_office, division_positions, division_unitsArray, division_years_of_service, divison_classification } from '@/lib/division-choices'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCurrentRole } from '@/hooks/user-role'
import { UpdateAccount } from '@/app/actions/updateAccount'

const NewAccount = () => {


    const router = useRouter()
    const user = useCurrentRole()
    const form = useForm<AccountSchemaType>({
      resolver: zodResolver(AccountSchema),
      defaultValues: {
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        sex: '',
        position: '',
        position_other: '',
        classification: '',
        section_or_unit: '',
        division_office: '',
        years_in_service: '',
        undergraduate_course: '',
        date_graduated: '',
        master_degree: '',
        doctorate_degree: '',
        school: '',
      }
    })
  
    const { mutate, isPending } = useMutation({
    mutationFn: UpdateAccount,
      onSuccess: (data) => {
        if (data?.success) {
          toast({
            title: "Success",
            description: data.success,
            variant: 'default'
          })
          router.replace('/main'); // Redirect to '/main'
          window.location.href = '/main'; // 
        } else if (data?.error) {
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
  
    const onSubmit = useCallback((values: AccountSchemaType) => {
      console.log("Submitting form with values:", values)
      mutate(values)
    }, [mutate])
  




    return (
        <>
            <div className='min-h-screen p-4 bg-gray-50'>
                <Card className='max-w-screen-2xl mx-auto'>
                    <CardHeader>
                        <CardTitle className='text-2xl font-bold text-center'>My Account</CardTitle>
                    </CardHeader> <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-1">
                                    <FormField
                                        control={form.control}
                                        name="first_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name*</FormLabel>
                                                <FormControl>
                                                    <Input type='text' placeholder="first name" {...field} />
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
                                                    <Input type='text' placeholder="middle name" {...field} />
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
                                                    <Input type='text' placeholder="last name" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="suffix"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Suffix</FormLabel>
                                                <FormControl>
                                                    <Input type='text' placeholder="JR. IV..." {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="sex"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Sex*</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="male" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Male
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="female" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Female
                                                            </FormLabel>
                                                        </FormItem>

                                                    </RadioGroup>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="position"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Position*</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="select position" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                    
                                                        {user === 'division_office' ? (
                                                            <>
                                                                {division_positions.map((item) => (
                                                                    <SelectItem key={item.id} value={item.value}>{item.value}</SelectItem>
                                                                ))}
                                                            </>
                                                        ) : (
                                                          <>
                                                          {school_positions.map((item) => (
                                                              <SelectItem key={item.id} value={item.value}>{item.value}</SelectItem>
                                                          ))}
                                                      </>
                                                        ) }
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="position_other"
                                        disabled={!form.watch('position').includes('OTHERS')}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Others</FormLabel>
                                                <FormControl>
                                                    <Input type='text' placeholder="other" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="classification"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Classification*</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="select position" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {user !== 'division_office' ? (
                                                            <>
                                                                {schools_classifications.map((item) => (
                                                                    <SelectItem key={item.id} value={item.value}>{item.value}</SelectItem>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {divison_classification.map((item) => (
                                                                    <SelectItem key={item.id} value={item.value}>{item.value}</SelectItem>
                                                                ))}
                                                            </>
                                                        )}

                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="years_in_service"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Years in Service*</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="years in service..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {user !== 'division_office' ? (
                                                            <>
                                                                {school_years_in_service.map((item) => (
                                                                    <SelectItem key={item.id} value={item.value}>{item.value}</SelectItem>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {division_years_of_service.map((item) => (
                                                                    <SelectItem key={item.id} value={item.value}>{item.value}</SelectItem>
                                                                ))}
                                                            </>
                                                        )}

                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    {user !== "division_office" && (
                                        <FormField
                                            control={form.control}
                                            name="school"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>School</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="select School..." />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {schools.map((item) => (
                                                                <SelectItem key={item.id} value={item.value}>{item.value}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {user === "division_office" && (
                                        <>
                                            <FormField
                                                control={form.control}
                                                name="section_or_unit"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Section/Unit</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="select position" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {division_unitsArray.map((item) => (
                                                                    <SelectItem key={item.id} value={item.value}>{item.value}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="division_office"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Divison Office</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="select division office" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {division_office.map((item) => (
                                                                    <SelectItem key={item.id} value={item.value}>{item.value}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </>
                                    )}



                                    {user === "division_office" && (
                                        <>
                                            <FormField
                                                control={form.control}
                                                name="undergraduate_course"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Undergraduate Course</FormLabel>
                                                        <FormControl>
                                                            <Input type='text' placeholder="undergraduate course..." {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="date_graduated"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Date Graduated</FormLabel>
                                                        <FormControl>
                                                            <Input type='date' placeholder="Date Graduated..." {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="master_degree"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Master Degree</FormLabel>
                                                        <FormControl>
                                                            <Input type='text' placeholder="master graduate..." {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="doctorate_degree"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Doctors Degree</FormLabel>
                                                        <FormControl>
                                                            <Input type='text' placeholder="doctors graduate..." {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </>
                                    )}
                                </div>


                                <Button
                                    disabled={isPending}
                                    className='w-full'
                                    type="submit"
                                >
                                    {isPending ? 'Submitting...' : 'Submit'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>

    )
}

export default NewAccount