"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, toast, yupResolver, type Resolver } from "@arabiaaislamia/ui";
import * as Yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { passwordRegex } from "@/constant/constant";
import { publicRoutes } from "@/utils/routes";
const SCOUTS_IMAGE = "/assets/signinLogo.png";
const ARABIA_LOGO = "/assets/JamiaArabiaLogo.png";
import Image from "next/image";
import { apiClient } from "@/utils/axios-instance";

const signUpSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .matches(
      passwordRegex,
      "Password must contain at least one uppercase letter and one special character"
    )
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type SignUpFormValues = Yup.InferType<typeof signUpSchema>;

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    defaultValues: { username: "", password: "" },
    resolver: yupResolver(signUpSchema) as Resolver<SignUpFormValues>,
  });

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      await apiClient.post("/api/auth/signup", {
        username: values.username,
        password: values.password,
      });
      toast.success("User registered successfully");
      router.push(publicRoutes.AUTH_SIGN_IN);
    } catch {
      toast.error("Failed to register");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm space-y-12 border border-green-200">
        <div className="flex flex-col items-center justify-center pb-5">
          <Image
            src={SCOUTS_IMAGE}
            alt="Logo"
            width={400}
            height={200}
          />
          <Image
            src={ARABIA_LOGO}
            alt="Logo"
            width={300}
            height={200}
            className="object-contain"
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-9">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Enter your username"
                />
              )}
            />
            {errors.username && (
              <div className="text-red-500 text-sm mt-1">{errors.username.message}</div>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    className="mt-1 block w-full p-2 border-none rounded-md shadow-sm focus:outline-none"
                    placeholder="Enter your password"
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-2 text-gray-500 hover:text-green-600"
              >
                {!showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
              </button>
            </div>
            {errors.password && (
              <div className="text-red-500 text-sm mt-1">{errors.password.message}</div>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            Register Your Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
