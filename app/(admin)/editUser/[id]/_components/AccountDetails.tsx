'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useParams } from 'next/navigation'
import SkeletonWrapper from '@/components/skeleton-wrapper'
import { UpdateAccountSchema, UpdateAccountSchemaType } from '@/lib/zod-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { division_office, division_positions, division_unitsArray, division_years_of_service, divison_classification } from '@/lib/division-choices'
import { school_positions, school_years_in_service, schools, schools_classifications } from '@/lib/school-choices'
import { useCurrentRole } from '@/hooks/user-role'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Update } from 'next/dist/build/swc'
import { getAccountDetails, updateAccount } from '@/hooks/react-query-hooks'

const AccountDetails = ({ affiliationOfUser }: { affiliationOfUser: string | undefined }) => {

    const { id } = useParams()
    const role = useCurrentRole()

    const UpdateAccountDetail = updateAccount(id)
    const AccountDetail = getAccountDetails(id)

    console.log(role)




    const accountForm = useForm<UpdateAccountSchemaType>({
        resolver: zodResolver(UpdateAccountSchema)
    })


    const handleSubmit = useCallback((values: UpdateAccountSchemaType) => {
        if (affiliationOfUser === 'school') {
            values.section_or_unit = '';
            values.division_office = '';
            values.undergraduate_course = '' ;
            values.master_degree = '';
            values.doctorate_degree = '';
        }

        UpdateAccountDetail.mutate(values)
    }, [UpdateAccountDetail])




    useEffect(() => {
        if (AccountDetail.data) {
            accountForm.reset({
                first_name: AccountDetail.data.first_name || "",
                middle_name: AccountDetail.data.middle_name || "",
                last_name: AccountDetail.data.last_name || "",
                sex: AccountDetail.data.sex,
                suffix: AccountDetail.data.suffix || "",
                position: AccountDetail.data.position,
                position_other: AccountDetail.data.position_other || "",
                classification: AccountDetail.data.classification,
                years_in_service: AccountDetail.data.years_in_service,
                section_or_unit: AccountDetail.data.section_or_unit || "",
                division_office: AccountDetail.data.division_office || "",
                undergraduate_course: AccountDetail.data.undergraduate_course || "",
                date_graduated: AccountDetail.data.date_graduated || "",
                doctorate_degree: AccountDetail.data.doctorate_degree || "",
                master_degree: AccountDetail.data.master_degree || "",
                school: AccountDetail.data.school || "",
            })
        }
    }, [AccountDetail.data, accountForm.reset])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account/Personal Details</CardTitle>
                <CardDescription>This part is where you edit the personal details such as first name, middle name, last name, position, classification, section/unit, etc...</CardDescription>
            </CardHeader>
            <CardContent>
                <SkeletonWrapper isLoading={AccountDetail.isLoading}>
                    <Form {...accountForm}>
                        <form onSubmit={accountForm.handleSubmit(handleSubmit)} className="space-y-8">
                            <div className='flex flex-col items-start justify-center gap-2'>
                                <p className="text-muted-foreground font-semibild-pb-2">Account Details</p>
                                <div className='w-full gap-4 grid grid-cols-1 md:grid-cols-2'>
                                    {/* total of 9*/}
                                    <div>
                                        <FormField
                                            control={accountForm.control}
                                            defaultValue={AccountDetail.data?.first_name || ""}
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
                                            control={accountForm.control}
                                            defaultValue={AccountDetail.data?.middle_name || ""}
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
                                            control={accountForm.control}
                                            defaultValue={AccountDetail.data?.last_name || ""}
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
                                            control={accountForm.control}
                                            name="sex"
                                            defaultValue={AccountDetail.data?.sex}


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
                                            control={accountForm.control}
                                            defaultValue={AccountDetail.data?.suffix || ""}
                                            name="suffix"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Suffix*</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" placeholder="Suffix" {...field} />
                                                    </FormControl>

                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={accountForm.control}
                                            name="position"
                                            defaultValue={AccountDetail.data?.position}

                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Position*</FormLabel>
                                                    <Select
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
                                            control={accountForm.control}
                                            defaultValue={AccountDetail.data?.position_other || ""}
                                            name="position_other"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Other</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" placeholder="Position Other" {...field} />
                                                    </FormControl>

                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={accountForm.control}
                                            name="classification"
                                            defaultValue={AccountDetail.data?.classification}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Classification*</FormLabel>
                                                    <Select
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
                                            control={accountForm.control}
                                            name="years_in_service"
                                            defaultValue={AccountDetail.data?.years_in_service}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Years in Service*</FormLabel>
                                                    <Select
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



                                    </div>

                                    <div>
                                        {affiliationOfUser !== "division_office" && (
                                            <FormField
                                                control={accountForm.control}
                                                name="school"
                                                defaultValue={AccountDetail.data?.school || ""}

                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>School</FormLabel>
                                                        <Select
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
                                        {affiliationOfUser === "division_office" && (
                                            <>
                                                <FormField
                                                    control={accountForm.control}
                                                    name="section_or_unit"
                                                    defaultValue={AccountDetail.data?.section_or_unit || ""}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Section/Unit</FormLabel>
                                                            <Select
                                                                onValueChange={field.onChange}
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
                                                    control={accountForm.control}
                                                    name="division_office"
                                                    defaultValue={AccountDetail.data?.division_office || ""}

                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Divison Office</FormLabel>
                                                            <Select
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
                                                <FormField
                                                    control={accountForm.control}
                                                    name="undergraduate_course"
                                                    defaultValue={AccountDetail.data?.undergraduate_course || ""}

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
                                                    control={accountForm.control}
                                                    name="date_graduated"
                                                    defaultValue={AccountDetail.data?.date_graduated || ""}
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
                                                    control={accountForm.control}
                                                    name="master_degree"
                                                    defaultValue={AccountDetail.data?.master_degree || ""}
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
                                                    control={accountForm.control}
                                                    name="doctorate_degree"
                                                    defaultValue={AccountDetail.data?.doctorate_degree || ""}

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
                                </div>
                            </div>
                            <Button
                                disabled={UpdateAccountDetail.isPending}
                                type='submit'>
                                {UpdateAccountDetail.isPending ? 'Updating...' : 'Update'}
                            </Button>
                        </form>
                    </Form>
                </SkeletonWrapper>
            </CardContent>
        </Card>

    )
}

export default AccountDetails