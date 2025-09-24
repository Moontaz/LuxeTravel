"use client";
import React, { useState } from "react";
import { handleLogin, handleRegister } from "@/controllers/authController";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRegisterInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegisterData({
      ...registerData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage("");
    setAlertStatus(null);

    try {
      if (activeTab === "login") {
        try {
          await handleLogin(loginData);
          setAlertMessage("Login Successfully!");
          setAlertStatus("success");
          setTimeout(() => {
            router.push("/");
          }, 400);
        } catch (error: unknown) {
          setAlertStatus("error");
          if (error instanceof AxiosError && error.response) {
            if (error.response.status === 404) {
              setAlertMessage("Email not found");
            } else if (error.response.status === 401) {
              setAlertMessage("Invalid password");
            } else if (error.response.status === 500) {
              setAlertMessage("Database error");
            } else {
              setAlertMessage("An unknown error occurred");
            }
          } else {
            // For other types of errors (e.g., network issues)
            setAlertMessage(
              (error as Error).message || "An unknown error occurred"
            );
            setAlertStatus("error");
          }
        } finally {
          setTimeout(() => {
            setAlertMessage("");
            setAlertStatus(null);
          }, 2000);
          setLoading(false);
        }
      } else {
        // Handle registration
        await handleRegister(registerData);
        setAlertStatus("success");
        setAlertMessage("Registered successfully!");
        setLoading(false);
        setTimeout(() => {
          setAlertMessage("");
          setAlertStatus(null);
        }, 2000);
      }
    } catch (error: unknown) {
      setAlertStatus("error");
      if (error instanceof Error) {
        setAlertMessage(error.message);
      } else {
        setAlertMessage("An error occurred during submission.");
      }
      setLoading(false);
      setTimeout(() => {
        setAlertMessage("");
        setAlertStatus(null);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden">
      <Card className="w-[768px] h-[657px] rounded-none flex flex-row border-0 z-10">
        {/* Kiri: Header dengan background image */}
        <CardHeader className="relative w-[500px] h-[657px] justify-end gap-10 pb-10 text-white">
          {/* Background Image */}
          <Image
            src={activeTab === "login" ? "/images/bg1.png" : "/images/bg2.png"}
            alt="Login BG-Luxe Travel"
            fill
            className="object-cover"
            priority
          />

          {/* Konten Judul & Deskripsi */}
          <div className="relative z-10 flex flex-col gap-4">
            <CardTitle className="font-bold">
              {activeTab === "login"
                ? "Welcome Back!"
                : "Create Your Account Now!"}
            </CardTitle>
            <CardDescription className="text-white text-sm">
              {activeTab === "login"
                ? "Login to your account to manage your bookings, preferences, and more."
                : "By creating an account, you’ll enjoy personalized travel recommendations, faster bookings, and exclusive offers."}
            </CardDescription>
          </div>

          {/* Footer Kecil */}
          <div className="relative z-10 flex flex-row items-center text-desc gap-8">
            <p>Luxe Travel 2025. All rights reserved.</p>
            <div className="flex flex-row gap-2 underline text-desc font-bold cursor-pointer">
              <span>Terms of Service</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </CardHeader>

        {/* Kanan: Form Tabs */}
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            className="w-[268px] h-full"
          >
            {/* LOGIN */}
            <TabsContent
              value="login"
              className="w-full h-full flex flex-col items-center justify-center data-[state=inactive]:hidden"
            >
              <div className="w-full flex flex-col gap-8">
                {/* Header Form */}
                <div className="login-form-header">
                  <h5 className="mb-2">Login Now!</h5>
                  <div className="text-sm text-muted-foreground">
                    Welcome back! Please enter details.
                  </div>
                </div>

                {/* Form Login */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        className="rounded-none"
                        value={loginData.email}
                        onChange={handleLoginInputChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        className="rounded-none"
                        value={loginData.password}
                        onChange={handleLoginInputChange}
                      />
                    </div>

                    <div className="flex flex-row justify-between items-center">
                      <div className="flex flex-row gap-2 items-center">
                        <Input
                          type="checkbox"
                          className="rounded-none w-4 h-4"
                        />
                        <Label htmlFor="remember-me">
                          <p className="text-desc">Remember me</p>
                        </Label>
                      </div>
                      <span className="text-sm text-primary underline cursor-pointer">
                        Forgot Password?
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-sm rounded-none bg-[#CBFF3E] text-primary hover:bg-[#CBFF3E]/90"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Login"}
                  </Button>
                </form>

                {/* Quick Links */}
                <div className="login-quick flex flex-col gap-2 items-center">
                  <p className="text-sm font-light text-muted-foreground">
                    Don't have an account?{" "}
                    <span
                      className="text-primary font-medium underline cursor-pointer"
                      onClick={() => setActiveTab("register")}
                    >
                      Register
                    </span>
                  </p>
                  {/* Divider with text */}
                  <div className="flex items-center w-full gap-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="text-sm text-gray-500">
                      Or continue with
                    </span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>
                  {/* Social login buttons */}
                  <div className="flex justify-center gap-4">
                    <button className="border border-gray-400 p-1 w-8 h-8 flex items-center justify-center">
                      <Image
                        src="/icons/google.svg"
                        alt="Google"
                        // className="w-8 h-8"
                        width={32}
                        height={32}
                      />
                    </button>
                    <button className="border border-gray-400 p-1 w-8 h-8 flex items-center justify-center">
                      <Image
                        src="/icons/x.svg"
                        alt="X"
                        width={32}
                        height={32}
                      />
                    </button>
                    <button className="border border-gray-400 p-1 w-8 h-8 flex items-center justify-center">
                      <Image
                        src="/icons/facebook.svg"
                        alt="Facebook"
                        width={32}
                        height={32}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* REGISTER */}
            <TabsContent
              value="register"
              className="w-full h-full flex flex-col items-center justify-center data-[state=inactive]:hidden"
            >
              <div className="w-full flex flex-col gap-8">
                {/* Header Form */}
                <div className="login-form-header">
                  <h5 className="mb-2">Register Now!</h5>
                  <div className="text-sm text-muted-foreground">
                    Register now to start your journey!
                  </div>
                </div>

                {/* Form Register */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        className="rounded-none"
                        value={registerData.name}
                        onChange={handleRegisterInputChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        className="rounded-none"
                        value={registerData.email}
                        onChange={handleRegisterInputChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        className="rounded-none"
                        value={registerData.password}
                        onChange={handleRegisterInputChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="rounded-none"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterInputChange}
                      />
                    </div>

                    <div className="flex flex-row gap-2 items-center">
                      <Input type="checkbox" className="rounded-none w-4 h-4" />
                      <Label htmlFor="terms">
                        <p className="text-desc font-light">
                          I agree to{" "}
                          <span className="underline font-bold cursor-pointer">
                            Terms of Conditions
                          </span>{" "}
                          and{" "}
                          <span className="underline font-bold cursor-pointer">
                            Privacy of Policy
                          </span>
                        </p>
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-sm rounded-none bg-[#CBFF3E] text-primary hover:bg-[#CBFF3E]/90"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Register"}
                  </Button>
                </form>

                {/* Quick Links */}
                <div className="login-quick flex flex-col gap-2 items-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <span
                      className="text-primary underline cursor-pointer"
                      onClick={() => setActiveTab("login")}
                    >
                      Login
                    </span>
                  </p>
                  {/* Divider with text */}
                  <div className="flex items-center w-full gap-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="text-sm text-gray-500">
                      Or continue with
                    </span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>
                  {/* Social login buttons */}
                  <div className="flex justify-center gap-4">
                    <button className="border border-gray-400 p-1 w-8 h-8 flex items-center justify-center">
                      <Image
                        src="/icons/google.svg"
                        alt="Google"
                        width={32}
                        height={32}
                      />
                    </button>
                    <button className="border border-gray-400 p-1 w-8 h-8 flex items-center justify-center">
                      <Image
                        src="/icons/x.svg"
                        alt="X"
                        width={32}
                        height={32}
                      />
                    </button>
                    <button className="border border-gray-400 p-1 w-8 h-8 flex items-center justify-center">
                      <Image
                        src="/icons/facebook.svg"
                        alt="Facebook"
                        width={32}
                        height={32}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ALERT STATUS */}
      {alertStatus && (
        <div
          className={`absolute top-4 p-2 rounded-none text-white text-xs
      ${alertStatus === "success" ? "bg-green-500" : "bg-red-500"} 
      flex items-center gap-2`}
        >
          {alertStatus === "success" ? (
            <CheckCircle size={16} />
          ) : (
            <XCircle size={16} />
          )}
          <span>{alertMessage}</span>
        </div>
      )}
      {/* Background Text */}
      <div className="absolute inset-0 font-bold pointer-events-none select-none z-0 overflow-hidden">
        <h1 className="absolute w-full left-2/3 -translate-x-1/2 font-normal text-[14rem] tracking-[-2rem] opacity-10 leading-none">
          LUXE TRAVEL
        </h1>
        <h1 className="absolute top-1/3 right-10 font-normal text-[14rem] tracking-[-2rem] opacity-10 leading-none">
          LUXE
        </h1>
        <h1 className="absolute -bottom-10 left-0 font-normal text-[14rem] tracking-[-2rem] opacity-10 leading-none">
          LUXE TRAVEL
        </h1>
      </div>
    </div>
  );
};

export default AuthPage;
