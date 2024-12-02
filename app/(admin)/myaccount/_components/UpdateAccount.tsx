'use client'
import { AccountSchema, AccountSchemaType } from '@/lib/zod-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCurrentRole } from '@/hooks/user-role'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const UpdateAccountComponent = ({ user }: { user: string }) => {

    const { id } = useParams()
    const router = useRouter()
    const role = useCurrentRole()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [openPositionOther, setOpenPositionOther] = useState(false)


    //FETCH DATA
    const { data, error, isPending: userAccountisPending } = useQuery({
        queryKey: ['userAccount', id],
        queryFn: async () => {
            const res = await fetch(`/api/account/${id}`)
            return res.json()
        },
    })


    const form = useForm<AccountSchemaType>({
        resolver: zodResolver(AccountSchema),

    })


    useEffect(() => {
        if (form.watch('position') === 'OTHERS (Please Specify)') {
            setOpenPositionOther(true)
        }
        setOpenPositionOther(false)
    }, [data, form.watch()])


    const updateAccount = useMutation({
        mutationKey: ['updateUser'],
        mutationFn: async (values: AccountSchemaType) => {
            const res = await fetch(`/api/updateAccount/${id}`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              });
              
              if (!res.ok) {
                const errorText = await res.text();
                console.error("Server response error:", errorText);
                throw new Error("Failed to update account");
              }
        },
        onSuccess: () => {
            toast({
                title: "Account updated successfully",
            })
            setIsDialogOpen(false);
            router.replace('/main'); // Redirect to '/main'
            window.location.href = '/main'; // fresh data if needed
        },
        onError: (err: Error) => {
            toast({
                title: err.message || "Something went wrong"
            })
        },
    })

    const onSubmit = useCallback(
        (values: AccountSchemaType) => {
            const isConfirmed = confirm(
                "Are you sure you want to submit this? This action cannot be edited."
            );
            if (isConfirmed) {
               updateAccount.mutate(values);
            }
        },
        [updateAccount]
    );

    if (userAccountisPending) {
        return `Loading...`
    }

    return (
        <>
            <div className='min-h-screen p-4 bg-gray-50'>
                <Card className='max-w-screen-2xl mx-auto'>
                    <CardHeader>
                        <CardTitle className='text-2xl font-bold text-center'>My Account</CardTitle>
                        <CardDescription>
                            {data?.locked ? "If there is something need to change, contact administrator to edit your personal information." : "Please update your personal information carefully. Once submitted, further edits will not be possible. To make changes, you will need to contact your administrator."}
                        </CardDescription>
                    </CardHeader> <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-1">
                                    <FormField
                                        control={form.control}
                                        name="first_name"
                                        defaultValue={data?.first_name || ""}
                                        disabled={data?.locked}
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
                                        defaultValue={data?.middle_name || ""}
                                        disabled={data?.locked}

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
                                        defaultValue={data?.last_name || ""}
                                        disabled={data?.locked}

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
                                        defaultValue={data?.suffix || ''}
                                        disabled={data?.locked}

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
                                        defaultValue={data?.sex || ""}


                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Sex*</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                        disabled={data?.locked}
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
                                        defaultValue={data?.position || ""}

                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Position*</FormLabel>
                                                <Select
                                                    disabled={data?.locked}
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="select position" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {role === 'division_office' ? (
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
                                                        )}

                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="position_other"
                                        disabled={form.watch('position') !== 'OTHERS (Please Specify)'}
                                        defaultValue={data?.position_other ? data?.position_other : ""}
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
                                        defaultValue={data?.classification || ""}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Classification*</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    disabled={data?.locked}
                                                    defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="select position" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {role === 'division_office' ? (
                                                            <>
                                                                {divison_classification.map((item) => (
                                                                    <SelectItem key={item.id} value={item.value}>{item.value}</SelectItem>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {schools_classifications.map((item) => (
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
                                        defaultValue={data?.years_in_service || ""}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Years in Service*</FormLabel>
                                                <Select
                                                    disabled={data?.locked}
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="years in service..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {role === 'division_office' ? (
                                                            <>
                                                                {division_years_of_service.map((item) => (
                                                                    <SelectItem key={item.id} value={item.value}>{item.value}</SelectItem>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {school_years_in_service.map((item) => (
                                                                    <SelectItem key={item.id} value={item.value}>{item.value}</SelectItem>
                                                                ))}
                                                            </>
                                                        )}


                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    {role !== "division_office" && (
                                        <FormField
                                            control={form.control}
                                            name="school"
                                            defaultValue={data?.school || ''}

                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>School</FormLabel>
                                                    <Select
                                                        disabled={data?.locked}
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}>
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

                                    {role === "division_office" && (
                                        <>
                                            <FormField
                                                control={form.control}
                                                name="section_or_unit"
                                                defaultValue={data?.section_or_unit || ''}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Section/Unit</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            disabled={data?.locked}
                                                            defaultValue={field.value}>
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
                                                defaultValue={data?.division_office || ''}

                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Divison Office</FormLabel>
                                                        <Select
                                                            disabled={data?.locked}
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}>
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



                                    {role === "division_office" && (
                                        <>
                                            <FormField
                                                control={form.control}
                                                name="undergraduate_course"
                                                defaultValue={data?.undergraduate_course || ''}
                                                disabled={data?.locked}

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
                                                defaultValue={data?.date_graduated || ''}
                                                disabled={data?.locked}
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
                                                defaultValue={data?.master_degree || ''}
                                                disabled={data?.locked}
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
                                                defaultValue={data?.doctorate_degree || ''}
                                                disabled={data?.locked}

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
                                    onClick={() => form.handleSubmit(onSubmit)()}
                                    className="w-full"
                                    type="button"
                                    disabled={data?.locked ? data?.locked : updateAccount.isPending}
                                >
                                    Confirm and Submit
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>

    )
}

export default UpdateAccountComponent