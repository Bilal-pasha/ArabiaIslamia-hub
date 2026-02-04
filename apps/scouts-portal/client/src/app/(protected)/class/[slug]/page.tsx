// src/app/classes/[slug]/page.tsx
import ClassPage from "@/components/ClassPage/ClassPage";
const page = ({ params }: { params: { slug: string } }) => {
  const classSlug = params.slug;
  return <ClassPage classSlug={classSlug}/>
};
export default page;
