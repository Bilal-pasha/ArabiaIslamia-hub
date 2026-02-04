export {
  useForm,
  useFormContext,
  Controller,
  FormProvider,
  useController,
  useWatch,
  useFieldArray,
} from 'react-hook-form';
export type { Control, FieldValues, UseFormReturn, ControllerProps, Resolver } from 'react-hook-form';
/** Use with cast: resolver: yupResolver(schema) as Resolver<YourFormValues> to avoid Yup-inferred type mismatches. */
export { yupResolver } from '@hookform/resolvers/yup';
