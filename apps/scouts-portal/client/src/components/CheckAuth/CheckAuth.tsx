/**
 * Pass-through HOC. Auth is enforced by Next.js middleware (cookie check);
 * no client-side user check is performed here.
 */
const CheckAuthentication = (WrappedComponent: React.ComponentType<Record<string, unknown>>) => {
  const Auth = (props: Record<string, unknown>) => <WrappedComponent {...props} />;
  return Auth;
};

export default CheckAuthentication;
