"use client";
import { useForm, Controller, toast, yupResolver, type Resolver } from "@arabiaaislamia/ui";
import * as Yup from "yup";
const SCOUTS_IMAGE = "/assets/signinLogo.png";
const ARABIA_LOGO = "/assets/JamiaArabiaLogo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { publicRoutes } from "@/utils/routes";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { apiClient } from "@/utils/axios-instance";

const forgotPasswordSchema = Yup.object({
  username: Yup.string().required("User ID is required"),
  newPassword: Yup.string().required("New password is required"),
});

type ForgotPasswordFormValues = Yup.InferType<typeof forgotPasswordSchema>;

const ResetPassword = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { username: "", newPassword: "" },
    resolver: yupResolver(forgotPasswordSchema) as Resolver<ForgotPasswordFormValues>,
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await apiClient.post("/api/auth/reset-password", values);
      toast.success("Password has been reset successfully");
      router.push(publicRoutes.AUTH_SIGN_IN);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to reset password";
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center h-screen justify-center bg-gray-50">
      <div className="p-8 m-6 md:m-0 rounded-lg shadow-2xl drop-shadow-xl w-full max-w-md bg-white border border-green-200">
        <div className="flex flex-col items-center justify-center pb-5">
          <Image src={SCOUTS_IMAGE} alt="Logo" width={400} height={200} />
          <Image
            src={ARABIA_LOGO}
            alt="Logo"
            width={300}
            height={200}
            className="object-contain"
          />
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              User ID
            </label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="username"
                  placeholder="Enter your User ID"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              )}
            />
            {errors.username && (
              <div className="text-red-500 text-sm mt-1">{errors.username.message}</div>
            )}
          </div>

          <div className="mb-6 relative">
            <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-500">
                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      placeholder="Enter your new password"
                      className="w-full px-4 py-2 border-none rounded-md focus:outline-none"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-2 text-gray-500 hover:text-green-600"
                >
                  {!showPassword ? (
                    <AiFillEyeInvisible size={24} />
                  ) : (
                    <AiFillEye size={24} />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <div className="text-red-500 text-sm mt-1">{errors.newPassword.message}</div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isSubmitting ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                } text-white font-semibold py-2 px-4 rounded-lg w-full transition-colors duration-200`}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
