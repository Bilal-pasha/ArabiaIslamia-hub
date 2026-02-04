import * as Yup from 'yup';

export const StudentSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    fatherName: Yup.string().required('Father name is required'),
    rollNumber: Yup.string().required('Roll number is required'),
    fees: Yup.number().required('Fees is required').positive('Fees must be positive'),
    status: Yup.string().oneOf(['Paid', 'Unpaid'], 'Invalid status').required('Status is required'),
  });