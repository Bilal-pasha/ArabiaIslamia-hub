import { publicRoutes } from '@/utils/routes';
import { redirect } from 'next/navigation';
export default async function Page() {
  redirect(publicRoutes.AUTH_SIGN_IN);
  return <></>;
}