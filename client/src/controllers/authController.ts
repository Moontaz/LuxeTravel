import { login, register } from "@/api/auth";

// Function to handle login
export const handleLogin = async (loginData: {
  email: string;
  password: string;
}) => {
  try {
    const result = await login(loginData);

    if (!result.success) {
      throw new Error((result.error as Error)?.message || "Login failed");
    }

    return result.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unexpected error: ${(error as Error).message}`);
  }
};

export const handleRegister = async (registerData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  if (registerData.password !== registerData.confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  try {
    const result = await register({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
    });

    if (!result.success) {
      throw new Error(
        (result.error as Error)?.message || "Registration failed"
      );
    }

    return result.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unexpected error: ${(error as Error).message}`);
  }
};
