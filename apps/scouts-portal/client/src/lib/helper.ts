export async function parseFormData(req: Request) {
    const formData = await req.formData();
    const fields: { [key: string]: any } = {};
    let file: File | null = null;
  
    // Check all entries in the form data
    formData.forEach((value, key) => {
      if (value instanceof Blob) {
        file = value as File; // Set the file if it's a Blob
      } else {
        fields[key] = value.toString(); // Add non-file fields
      }
    });
  
  
    return { fields, file };
  }