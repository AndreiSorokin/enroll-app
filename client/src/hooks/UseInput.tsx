import { useFormik, FormikValues, FormikHelpers } from 'formik';
import { ZodSchema } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

export default function useInput<T extends FormikValues>(
  schema: ZodSchema<T>, 
  initialValues: T, 
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void
) {
  const formik = useFormik<T>({
    initialValues,
    validationSchema: toFormikValidationSchema(schema),
    onSubmit,
  });

  return formik;
}