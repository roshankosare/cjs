"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiMail, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

type SignInForm = {
  email: string;
  password: string;
};

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>();

  const onSubmit = (data: SignInForm) => {
    console.log("Form Data:", data);
   
  };

  return (
    <Card className="w-[350px] max-h-[540px] rounded-2xl shadow-xl mt-5">
      <CardContent className="px-4 py-2 sm:px-6 sm:py-3">
        {/* Logo */}
        <div className="w-[50px] h-[50px] rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
          <p className="font-bold text-white text-xl">{"</>"}</p>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold text-gray-500 mb-8">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div className="mb-4">
            <div className="flex items-center gap-3 rounded-xl border px-4 py-1 focus-within:ring-2 focus-within:ring-blue-400">
              <FiMail className="text-sm text-gray-500" />
              <Input
                type="email"
                placeholder="Email"
                className="border-0 focus-visible:ring-0 p-0 text-sm"
                {...register("email", {
                  required: "Please enter your email",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-2">
            <div className="flex items-center gap-3 rounded-xl border px-4 py-1 focus-within:ring-2 focus-within:ring-blue-400">
              <FiLock className="text-sm text-gray-500" />
              <Input
                type="password"
                placeholder="Password"
                className="border-0 focus-visible:ring-0 p-0 text-sm"
                {...register("password", {
                  required: "Please enter your password",
                })}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right mb-6">
            <button
              type="button"
              className="text-sm text-gray-400 hover:text-blue-500"
            >
              Forgot password?
            </button>
          </div>

          {/* Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full text-md py-6 bg-gradient-to-r from-blue-400 to-indigo-500 hover:opacity-90 my-4"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 font-medium cursor-pointer hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignIn;
