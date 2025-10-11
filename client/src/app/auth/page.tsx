"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MailIcon,
  LockIcon,
  UserIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { handleLogin, handleRegister } from "../../controllers/authController";
import { gsap } from "gsap";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [alertStatus, setAlertStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data
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

  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }

    // Form animation
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.2 }
      );
    }
  }, []);

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertStatus(null);

    try {
      const result = await handleLogin(loginData);
      setAlertStatus({ type: "success", message: result });
      // Redirect to booking page after successful login
      setTimeout(() => {
        window.location.href = "/booking";
      }, 2000);
    } catch (error) {
      const err = error as Error;
      setAlertStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertStatus(null);

    if (registerData.password !== registerData.confirmPassword) {
      setAlertStatus({ type: "error", message: "Passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      const result = await handleRegister(registerData);
      setAlertStatus({ type: "success", message: result });
      // Switch to login tab after successful registration
      setTimeout(() => {
        setActiveTab("login");
        setRegisterData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }, 2000);
    } catch (error) {
      const err = error as Error;
      setAlertStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section ref={heroRef} className="section bg-gray-900 text-white">
        <div className="container text-center">
          <h1 className="text-4xl sm:text-5xl font-black mb-6">
            WELCOME TO LUXE TRAVEL
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Sign in to your account or create a new one to start your luxury
            journey
          </p>
        </div>
      </section>

      {/* Auth Form Section */}
      <section ref={formRef} className="section bg-gray-50">
        <div className="container">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="p-8">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="login" className="font-bold">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="register" className="font-bold">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  {/* Login Form */}
                  <TabsContent value="login" className="space-y-6">
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <MailIcon
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            className="pl-10"
                            placeholder="Enter your email"
                            value={loginData.email}
                            onChange={handleLoginInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <LockIcon
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={handleLoginInputChange}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOffIcon size={16} />
                            ) : (
                              <EyeIcon size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                        size="lg"
                      >
                        {loading ? "Signing in..." : "Sign In"}
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </form>

                    <div className="text-center">
                      <p className="text-gray-600">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          className="text-gray-900 font-bold hover:underline"
                          onClick={() => setActiveTab("register")}
                        >
                          Sign up here
                        </button>
                      </p>
                    </div>
                  </TabsContent>

                  {/* Register Form */}
                  <TabsContent value="register" className="space-y-6">
                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <UserIcon
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            className="pl-10"
                            placeholder="Enter your full name"
                            value={registerData.name}
                            onChange={handleRegisterInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="register-email">Email Address</Label>
                        <div className="relative">
                          <MailIcon
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                          <Input
                            id="register-email"
                            name="email"
                            type="email"
                            className="pl-10"
                            placeholder="Enter your email"
                            value={registerData.email}
                            onChange={handleRegisterInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="register-password">Password</Label>
                        <div className="relative">
                          <LockIcon
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                          <Input
                            id="register-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            placeholder="Create a password"
                            value={registerData.password}
                            onChange={handleRegisterInputChange}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOffIcon size={16} />
                            ) : (
                              <EyeIcon size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="confirm-password">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <LockIcon
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                          <Input
                            id="confirm-password"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            placeholder="Confirm your password"
                            value={registerData.confirmPassword}
                            onChange={handleRegisterInputChange}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOffIcon size={16} />
                            ) : (
                              <EyeIcon size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                        size="lg"
                      >
                        {loading ? "Creating account..." : "Create Account"}
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </form>

                    <div className="text-center">
                      <p className="text-gray-600">
                        Already have an account?{" "}
                        <button
                          type="button"
                          className="text-gray-900 font-bold hover:underline"
                          onClick={() => setActiveTab("login")}
                        >
                          Sign in here
                        </button>
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Alert Status */}
                {alertStatus && (
                  <div
                    className={`mt-6 p-4 ${
                      alertStatus.type === "success"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    <p className="font-medium">{alertStatus.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AuthPage;
