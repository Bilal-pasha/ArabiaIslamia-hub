
export interface Student {
    name: string;
    fatherName: string;
    GRNumber: string;
    classSlug: string;
}

export interface PrintComponentProps {
    students: Student[];
}