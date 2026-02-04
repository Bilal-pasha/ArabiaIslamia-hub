import * as Yup from 'yup';
export const StudentSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  fatherName: Yup.string().required('Father name is required'),
  GRNumber: Yup.number().required('GR Number is required'),
  fees: Yup.number().required('Fees is required').positive('Fees must be positive'),
  status: Yup.string().oneOf(['Paid', 'Unpaid'], 'Invalid status').required('Status is required'),
  feesStatus: Yup.array()
    .of(Yup.object({ month: Yup.string(), status: Yup.string() }))
    .notRequired(),
  image: Yup.mixed()
    .notRequired()
    .test("fileSize", "File size must be less than 1 Mb", (value) => {
      return !value || (value as File).size <= 1024 * 1024; // Apply only if value exists
    })
    .test("fileType", "Unsupported file format", (value) => {
      return (
        !value ||
        ["image/jpeg", "image/png", "image/gif"].includes(
          (value as File).type
        )
      ); // Apply only if value exists
    }),
});