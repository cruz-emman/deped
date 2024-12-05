import { z } from "zod"


export const RegisterSchema = z.object({
    email: z.string().email().min(2, {
        message: "email must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: " Password must be at least 2 characters"
    })
})


export type RegisterSchemaType = z.infer<typeof RegisterSchema>




export const LoginSchema = z.object({
    email: z.string().email().min(2, {
        message: "email must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: " Password must be at least 2 characters"
    })
})


export type LoginSchemaType = z.infer<typeof LoginSchema>





export const AccountSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    middle_name: z.string().min(1, 'Middle name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    sex: z.string().min(2, { message: "Select input field" }),
    suffix: z.string().optional(),

    position: z.string().min(1, 'Position is required'),
    position_other: z.string().optional(),
    classification: z.string().min(1, 'Classification is required'),
    section_or_unit: z.string().optional(),
    division_office: z.string().optional(),
    years_in_service: z.string().min(1, { message: "Select Years" }),
    undergraduate_course: z.string().optional(),
    date_graduated: z.string().optional(),
    doctorate_degree: z.string().optional(),
    master_degree: z.string().optional(),
    school: z.string().optional(),
})

export type AccountSchemaType = z.infer<typeof AccountSchema>




export const CreateRoleAccountSchema = z.object({
    name: z.string().min(6, { message: "Username must be at least 6 letters" }), // Fixed typo and increased min length
    password: z.string().min(2, {
        message: " Password must be at least 2 characters"
    }),
    // password: z.string()
    //     .min(8, {message: "Password must be at least 8 characters"}) // Recommended minimum password length
    //     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
    //         {message: "Password must include uppercase, lowercase, number, and special character"}),
    email: z.string().email({ message: "Invalid email format" }),
    role: z.enum([
        "super_admin",
        "division_office_admin",
        "division_office",
        "school_admin",
        "teacher",
      ]),
    affiliation: z.enum(['division_office', 'school'], {
        errorMap: () => ({ message: "Select a valid Affiliation" })
    }),})

export type CreateRoleAccountSchemaType = z.infer<typeof CreateRoleAccountSchema>




export const CertificateSchema = z.object({
    training_title: z.string().min(2, { message: "Title must be at least 2 letters" }),
    training_year: z.string().min(2, { message: "Training year must be selected" }),
    training_from: z.string().min(2, { message: "Select Date" }),
    training_to: z.string().min(2, { message: "Select Date" }),
    training_number_of_hours: z.string().min(2, {message: "Number of years"}),
    training_sponsored_by: z.string().min(2, { message: "Sponsored by must be at least 2 letters" }),
    training_name_of_provider: z.string().min(2, { message: "Name of provider must be at least 2 letters" }),
    training_category: z.string().min(2, { message: "Category must be at least 2 letters" }),
    training_internation: z.string().min(2, { message: "Select internataion" }),
    training_certificate: z.instanceof(File).optional()
})

export type CertificateSchemaType = z.infer<typeof CertificateSchema>