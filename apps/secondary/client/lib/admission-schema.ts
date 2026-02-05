import { z } from 'zod';

// Shared regex
const phoneRegex = /^[+]?[\d\s\-()]{10,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Step 1: Personal Information
export const personalInfoSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(150, 'Name must be at most 150 characters'),
  fatherName: z
    .string()
    .min(2, "Father's name must be at least 2 characters")
    .max(150, "Father's name must be at most 150 characters"),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((val) => {
      const parsed = new Date(val + 'T12:00:00');
      if (isNaN(parsed.getTime())) return false;
      const year = parsed.getFullYear();
      const currentYear = new Date().getFullYear();
      return year >= 1920 && year <= currentYear;
    }, 'Please enter a valid date of birth'),
  gender: z
    .union([z.enum(['male', 'female']), z.literal('')])
    .refine((val) => val === 'male' || val === 'female', 'Please select gender'),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .regex(phoneRegex, 'Please enter a valid phone number'),
  email: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || emailRegex.test(val), 'Please enter a valid email address'),
  idNumber: z.string().optional().or(z.literal('')),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address must be at most 500 characters'),
  permanentAddress: z.string().max(500).optional().or(z.literal('')),
  country: z.string().min(1, 'Please select your country'),
  state: z.string().min(1, 'State / Province is required').max(150, 'State must be at most 150 characters'),
  city: z.string().min(1, 'City is required').max(150, 'City must be at most 150 characters'),
  area: z.string().min(1, 'Area is required').max(150, 'Area must be at most 150 characters'),
  language: z.string().min(1, 'Language is required').max(100, 'Language must be at most 100 characters'),
});

// Step 2: Guardian Information
export const guardianInfoSchema = z.object({
  guardianName: z
    .string()
    .min(2, 'Guardian name must be at least 2 characters')
    .max(150, 'Guardian name must be at most 150 characters'),
  guardianRelation: z
    .union([z.enum(['father', 'mother', 'guardian', 'other']), z.literal('')])
    .refine(
      (val) => ['father', 'mother', 'guardian', 'other'].includes(val),
      'Please select relation'
    ),
  guardianPhone: z
    .string()
    .min(10, 'Guardian phone must be at least 10 digits')
    .regex(phoneRegex, 'Please enter a valid phone number'),
  guardianEmail: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || emailRegex.test(val), 'Please enter a valid email'),
  guardianOccupation: z.string().optional().or(z.literal('')),
  guardianAddress: z.string().max(500).optional().or(z.literal('')),
});

// Step 3: Academic Information (department = Secondary, implied by form context)
export const academicInfoSchema = z.object({
  requiredClass: z.string().min(1, 'Please select required class'),
  previousSchool: z.string().optional().or(z.literal('')),
  previousClass: z.string().optional().or(z.literal('')),
  previousGrade: z.enum(['excellent', 'very-good', 'good', 'acceptable']).optional().or(z.literal('')),
  isHafiz: z.enum(['yes', 'no']).optional().or(z.literal('')),
  accommodationType: z
    .union([z.enum(['residential', 'non-residential']), z.literal('')])
    .refine(
      (val) => val === 'residential' || val === 'non-residential',
      'Please select accommodation type'
    ),
});

// Step 4: Documents (files optional for now - can be required later)
export const documentsSchema = z.object({
  photoFile: z.string().optional(),
  idFile: z.string().optional(),
  authorityLetterFile: z.string().optional(),
  previousResultFile: z.string().optional(),
});

// Full form schema
export const admissionFormSchema = personalInfoSchema
  .merge(guardianInfoSchema)
  .merge(academicInfoSchema)
  .merge(documentsSchema);

export type AdmissionFormData = z.infer<typeof admissionFormSchema>;

/** Form state type: allows empty string for enum fields before user selection */
export type AdmissionFormDataWithEmptyEnums = Omit<
  AdmissionFormData,
  'gender' | 'guardianRelation' | 'accommodationType'
> & {
  gender: '' | 'male' | 'female';
  guardianRelation: '' | 'father' | 'mother' | 'guardian' | 'other';
  accommodationType: '' | 'residential' | 'non-residential';
};

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type GuardianInfo = z.infer<typeof guardianInfoSchema>;
export type AcademicInfo = z.infer<typeof academicInfoSchema>;

// Step-specific validation helpers
export const stepSchemas = {
  1: personalInfoSchema,
  2: guardianInfoSchema,
  3: academicInfoSchema,
  4: documentsSchema,
} as const;

export function getStepSchema(step: number) {
  return stepSchemas[step as 1 | 2 | 3 | 4];
}

export function validateStep(
  step: number,
  data: Record<string, unknown>
): { success: boolean; errors?: Record<string, string> } {
  const schema = getStepSchema(step);
  if (!schema) return { success: true };

  const stepFields = Object.keys(schema.shape);
  const stepData: Record<string, unknown> = {};
  for (const key of stepFields) {
    stepData[key] = data[key] ?? '';
  }

  const result = schema.safeParse(stepData);
  if (result.success) return { success: true };

  const errors: Record<string, string> = {};
  if (result.error?.flatten().fieldErrors) {
    for (const [key, messages] of Object.entries(result.error.flatten().fieldErrors)) {
      if (messages?.[0]) errors[key] = messages[0];
    }
  }
  return { success: false, errors };
}
