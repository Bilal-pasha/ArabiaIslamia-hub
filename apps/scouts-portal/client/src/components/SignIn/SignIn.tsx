import { useState } from "react";
import { useForm, Controller, toast, yupResolver, type Resolver, Input, Label, Checkbox } from "@arabiaaislamia/ui";
import Link from "next/link";
import Image from "next/image";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
const SCOUTS_IMAGE = "/assets/signinLogo.png";
const ARABIA_LOGO = "/assets/JamiaArabiaLogo.png";
import { protectedRoutes, publicRoutes } from "@/utils/routes";
import { useRouter } from "next/navigation";
import { apiClient } from "@/utils/axios-instance";
import { useAuth } from "@/context/AuthContext";
import * as Yup from "yup";

const signInSchema = Yup.object({
  username: Yup.string().required("User Id is required"),
  password: Yup.string().required("Password is required"),
  rememberMe: Yup.boolean().optional(),
});

type SignInFormValues = Yup.InferType<typeof signInSchema>;

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { refetch } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    defaultValues: { username: "", password: "", rememberMe: false },
    resolver: yupResolver(signInSchema) as Resolver<SignInFormValues>,
  });

  const onSubmit = async (values: SignInFormValues) => {
    try {
      await apiClient.post("/api/auth/login", {
        username: values.username,
        password: values.password,
      });
      await refetch();
      toast.success("Signed in successfully");
      router.push(protectedRoutes.HOME);
    } catch {
      toast.error("User Id / Password Incorrect");
    }
  };

  return (
    <div className="flex items-center h-screen justify-center bg-gray-50 px-4">
      <div className="p-8 rounded-lg shadow-2xl drop-shadow-xl w-full max-w-md bg-white border border-green-200">
        <div className="flex flex-col items-center justify-center pb-5">
          <Image
            src={SCOUTS_IMAGE}
            alt="Logo"
            width={280}
            height={140}
            className="object-contain max-w-full h-auto"
          />
          <Image
            src={ARABIA_LOGO}
            alt="Logo"
            width={200}
            height={100}
            className="object-contain max-w-full h-auto"
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="username" className="text-gray-700 font-bold mb-2 block">
              User Id
            </Label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  id="username"
                  placeholder="Enter your User Id"
                  className="border-gray-300 focus:ring-green-500 focus:border-green-500"
                />
              )}
            />
            {errors.username && (
              <div className="text-red-500 text-sm mt-1">{errors.username.message}</div>
            )}
          </div>

          <div className="mb-6 relative">
            <Label htmlFor="password" className="text-gray-700 font-bold mb-2 block">
              Password
            </Label>
            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-green-500">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter your password"
                      className="border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-2 text-gray-500 hover:text-green-600 flex-shrink-0"
                >
                  {!showPassword ? (
                    <AiFillEyeInvisible size={24} />
                  ) : (
                    <AiFillEye size={24} />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="text-red-500 text-sm mt-1">{errors.password.message}</div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="inline-flex items-center gap-2">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="rememberMe"
                    ref={field.ref}
                    checked={!!field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    onBlur={field.onBlur}
                    className="border-green-600 data-[state=checked]:bg-green-600"
                  />
                )}
              />
              <Label htmlFor="rememberMe" className="text-gray-700 text-sm whitespace-nowrap cursor-pointer">
                Remember me
              </Label>
            </div>
            <Link
              href={publicRoutes.FORGOT_PASSWORD}
              className="text-sm text-green-600 hover:underline whitespace-nowrap"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="flex items-center justify-end mb-6">
            <Link
              href={publicRoutes.AUTH_SIGN_UP}
              className="text-sm text-green-600 hover:underline whitespace-nowrap"
            >
              Register?
            </Link>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isSubmitting ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                } text-white font-semibold py-2 px-4 rounded-lg w-full transition-colors duration-200`}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
