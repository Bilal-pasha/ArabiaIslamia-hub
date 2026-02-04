import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import scoutsImage from "/public/assets/signinLogo.png";
import ArabiaLogo from "/public/assets/JamiaArabiaLogo.png";
import { protectedRoutes, publicRoutes } from "@/utils/routes";
import { useRouter } from "next/navigation";
import { apiClient } from "@/utils/axios-instance";

interface SignInFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const router = useRouter()
  const initialValues: SignInFormValues = {
    username: "",
    password: "",
    rememberMe: false,
  };

  const handleSubmit = async (values: SignInFormValues) => {
    try {
      await apiClient.post("/api/auth/login", {
        username: values.username,
        password: values.password,
      });
      router.push(protectedRoutes.HOME);
      toast.success("Signed in successfully");
    } catch {
      toast.error("User Id / Password Incorrect");
    }
  };

  return (
    <div className="flex items-center h-screen justify-center bg-gray-50 px-4">
      <div className="p-8 rounded-lg shadow-2xl drop-shadow-xl w-full max-w-md bg-white border border-green-200">
        <div className="flex flex-col items-center justify-center pb-5">
          <Image
            src={scoutsImage}
            alt="Logo"
            width={280}
            height={140}
            className="object-contain max-w-full h-auto"
          />
          <Image
            src={ArabiaLogo}
            alt="Logo"
            width={200}
            height={100}
            className="object-contain max-w-full h-auto"
          />
        </div>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              {/* User Id input */}
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  User Id
                </label>
                <Field
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Enter your User Id"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password input */}
              <div className="mb-6 relative">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-green-500">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="Enter your password"
                      className="w-full px-4 py-2 border-none rounded-md focus:outline-none"
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
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <label className="inline-flex items-center">
                  <Field
                    type="checkbox"
                    name="rememberMe"
                    className="form-checkbox text-green-600"
                  />
                  <span className="ml-2 text-gray-700 text-sm whitespace-nowrap">
                    Remember me
                  </span>
                </label>
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

              {/* Login button */}
              <div className="mb-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${isSubmitting
                      ? "bg-gray-400"
                      : "bg-green-600 hover:bg-green-700"
                    } text-white font-semibold py-2 px-4 rounded-lg w-full transition-colors duration-200`}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignIn;
