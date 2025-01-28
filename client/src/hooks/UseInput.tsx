import { useFormik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

export default function UseInput(schema: z.ZodSchema<any>, initialValues: Record<string, any>, onSubmit: (values: any) => void) {
   const formik = useFormik({
      initialValues,
      validationSchema: toFormikValidationSchema(schema),
      onSubmit,
   });

   return {
      ...formik
   };
}