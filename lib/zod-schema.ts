import { z } from "zod"


export const RegisterSchema = z.object({
    email: z.string().email().min(2, {
        message: "email must be at least 2 characters.",
    }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" }) // Recommended minimum password length
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            { message: "Password must include uppercase, lowercase, number, and special character" }),
})


export type RegisterSchemaType = z.infer<typeof RegisterSchema>




export const LoginSchema = z.object({
    email: z.string().email().min(2, {
        message: "email must be at least 2 characters.",
    }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" }) // Recommended minimum password length
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            { message: "Password must include uppercase, lowercase, number, and special character" }),
})


export type LoginSchemaType = z.infer<typeof LoginSchema>





export const AccountSchema = z.object({
    first_name: z.string().min(1, 'First name is required').optional(),
    middle_name: z.string().min(1, 'Middle name is required').optional(),
    last_name: z.string().min(1, 'Last name is required').optional(),
    sex: z.string().min(2, { message: "Select input field" }),
    suffix: z.string().optional(),
    position: z.string().min(1, 'Position is required'),
    position_other: z.string().optional(),
    classification: z.string().min(1, 'Classification is required'),
    years_in_service: z.string().min(1, { message: "Select Years" }),

    //Division
    section_or_unit: z.string().optional(),
    division_office: z.string().optional(),
    undergraduate_course: z.string().optional(),
    date_graduated: z.string().optional(),
    doctorate_degree: z.string().optional(),
    master_degree: z.string().optional(),

    //School
    school: z.string().optional(),
})

export type AccountSchemaType = z.infer<typeof AccountSchema>



export const CreateRoleAccountSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: "Password must include uppercase, lowercase, number, and special character",
      }),
    email: z.string().email({ message: "Invalid email format" }),
    role: z.enum([
      "super_admin",
      "division_office_admin",
      "division_office",
      "school_admin",
      "teacher",
    ]),
    affiliation: z.enum(["division_office", "school"], {
      errorMap: () => ({ message: "Select a valid Affiliation" }),
    }),
    first_name: z.string(),
    middle_name: z.string(),
    last_name: z.string(),
    school_assigned: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { role, school_assigned } = data;
    const exemptedRoles = ["division_office", "division_office_admin", "super_admin"];

    // Check if school_assigned is missing or too short when required
    if (
      !exemptedRoles.includes(role) &&
      (!school_assigned || school_assigned.length < 8)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "School assigned is required for school_admin and teacher and must be at least 8 characters.",
        path: ["school_assigned"],
      });
    }
  });
export type CreateRoleAccountSchemaType = z.infer<typeof CreateRoleAccountSchema>



export const UploadExcelFileSchema = z.object({
    password: z.string()
        .min(8, { message: "Password must be at least 8 charact       ers" }) // Recommended minimum password length
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            { message: "Password must include uppercase, lowercase, number, and special character" }),
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
    }),
    first_name: z.string().optional(),
    middle_name: z.string().optional(),
    last_name: z.string().optional(),
    school_assigned: z.string().optional(),
})

export type UploadExcelFileSchemaType = z.infer<typeof UploadExcelFileSchema>




export const CertificateSchema = z.object({
    training_title: z.string().min(2, { message: "Title must be at least 2 letters" }),
    training_year: z.string().min(2, { message: "Training year must be selected" }),
    training_from: z.string().min(2, { message: "Please Select date" }),
    training_to: z.string().min(2, { message: "Please Select date" }),
    training_number_of_hours: z.string().min(2, { message: "Number of years" }),
    training_sponsored_by: z.string().min(2, { message: "Sponsored by must be at least 2 letters" }),
    training_name_of_provider: z.string().min(2, { message: "Name of provider must be at least 2 letters" }),
    training_category: z.string().min(2, { message: "Category must be at least 2 letters" }),
    training_international: z.string().min(2, { message: "Select internataion" }),
})

export type CertificateSchemaType = z.infer<typeof CertificateSchema>




//UPDATE ZOD



export const UpdateAccountSchema = z.object({
    first_name: z.string().min(1, 'First name is required').optional(),
    middle_name: z.string().min(1, 'Middle name is required').optional(),
    last_name: z.string().min(1, 'Last name is required').optional(),
    sex: z.string().min(2, { message: "Select input field" }).optional(),
    suffix: z.string().optional(),
    position: z.string().min(1, 'Position is required').optional(),
    position_other: z.string().optional(),
    classification: z.string().min(1, 'Classification is required').optional(),
    years_in_service: z.string().min(1, { message: "Select Years" }).optional(),

    //Division
    section_or_unit: z.string().optional(),
    division_office: z.string().optional(),
    undergraduate_course: z.string().optional(),
    date_graduated: z.string().optional(),
    doctorate_degree: z.string().optional(),
    master_degree: z.string().optional(),

    //School
    school: z.string().optional(),
})

export type UpdateAccountSchemaType = z.infer<typeof UpdateAccountSchema>



export const UpdateRoleAccountSchema = z.object({
    name: z.string().min(2, { message: "Username must be at least 2 letters" }).optional(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 charact       ers" }) // Recommended minimum password length
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            { message: "Password must include uppercase, lowercase, number, and special character" }),
    email: z.string().email({ message: "Invalid email format" }).optional(),
    role: z.enum([
        "super_admin",
        "division_office_admin",
        "division_office",
        "school_admin",
        "teacher",
    ]).optional(),
    affiliation: z.enum(['division_office', 'school'], {
        errorMap: () => ({ message: "Select a valid Affiliation" })
    }).optional(),
})

export type UpdateRoleAccountSchemaType = z.infer<typeof UpdateRoleAccountSchema>


export const UpdateUserCredentialSchema = z.object({
    email: z.string().email({ message: "Invalid email format" }).optional(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" }) // Recommended minimum password length
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            { message: "Password must include uppercase, lowercase, number, and special character" }).optional(),
})

export type UpdateUserCredentialSchemaType = z.infer<typeof UpdateUserCredentialSchema>




export const UpdateCertificateSchema = z.object({
    training_title: z.string().optional(),
    training_year: z.string().optional(),
    training_from: z.string().optional(),
    training_to: z.string().optional(),
    training_number_of_hours: z.string().optional(),
    training_sponsored_by: z.string().optional(),
    training_name_of_provider: z.string().optional(),
    training_category: z.string().optional(),
    training_international: z.string().optional(),
})

export type UpdateCertificateSchemaType = z.infer<typeof UpdateCertificateSchema>