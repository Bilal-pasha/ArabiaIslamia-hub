import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
    studentName: Yup.string().required("Student name is required"),
    FatherName: Yup.string().required("Father Name  is required"),
    age: Yup.number().required("Age is required").positive().integer(),
    grade: Yup.string().required("Grade is required"),
    TshirtSize: Yup.string().required("T-shirt Size is required"),
    activity: Yup.string().required("Activity is required"), // Validation for activity
});