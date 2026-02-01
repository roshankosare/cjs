"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiMail, FiLock, FiUser, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useAuth } from "@/auth/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpSchema } from "@/lib/schemas";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const [error, setError] = useState<string | null>(null);
  const { refetchUser } = useAuth();

  const onSubmit = async (data: SignUpSchema) => {
    try {
      setError(null);
      // Exclude confirmPassword from the API payload
      const { confirmPassword, ...payload } = data;
      await axios.post("http://localhost:5046/api/auth/signup", payload, {
        withCredentials: true,
      });
      refetchUser();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Sign-up error:", error.message);
        setError(
          error.response?.data?.message || "An error occurred during sign-up."
        );
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pt-10">
      <Card className="w-full rounded-xl shadow-lg border border-border bg-card">
        <CardContent className="px-6 py-8 sm:px-8 sm:py-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <p className="font-bold text-primary text-xl">{"</>"}</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Create Account
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Join our community of developers
            </p>
          </div>

          {error && (
            <div className="w-full px-4 py-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm text-center mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Username */}
            <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-muted-foreground" />
                </div>
                <Input
                  type="text"
                  placeholder="Username"
                  className="pl-10"
                  {...register("username")}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-destructive ml-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-muted-foreground" />
                </div>
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-muted-foreground" />
                </div>
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-destructive ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCheckCircle className="text-muted-foreground" />
                </div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="pl-10"
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive ml-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg h-10 text-sm font-medium mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Sign up"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-primary font-semibold hover:underline transition-all"
              >
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
