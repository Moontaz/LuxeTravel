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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to BusBooker</CardTitle>
          <CardDescription>
            Login or create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="login"
                className={cn(
                  "py-2 px-4 transition-colors duration-300",
                  activeTab === "login"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className={cn(
                  "py-2 px-4 transition-colors duration-300",
                  activeTab === "register"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                Register
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginInputChange}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Loading..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={registerData.name}
                    onChange={handleRegisterInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={registerData.email}
                    onChange={handleRegisterInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={registerData.password}
                    onChange={handleRegisterInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterInputChange}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Register
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        {alertStatus && (
          <div
            className={`mb-1 mt-1 max-w-2xl mx-auto p-2 rounded text-white text-xs ${
              alertStatus === "success" ? "bg-green-500" : "bg-red-500"
            } flex items-center gap-2`}
          >
            {alertStatus === "success" ? (
              <CheckCircle size={16} />
            ) : (
              <XCircle size={16} />
            )}
            <span>{alertMessage}</span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AuthPage;
