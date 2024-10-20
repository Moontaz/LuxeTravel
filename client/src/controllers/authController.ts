import axios from "axios";

// Function to handle login
export const handleLogin = async (loginData: {
  email: string;
  password: string;
}) => {
  const loginDataFood = {
    email: "luxetravel@example.com",
    password: "password123",
  };

  try {
    // request to BASE_URL to get token1
    const response1 = await axios.post(
      `${process.env.NEXT_PUBLIC_BUS_URL}/api/auth/login`,
      loginData,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Allow cookies to be sent from the backend
      }
    );

    // Set the token in cookies
    document.cookie = `token1=${response1.data.token}; path=/; max-age=3600; SameSite=Lax`;

    // request to FOOD_URL to get token2
    const response2 = await axios.post(
      `${process.env.NEXT_PUBLIC_FOOD_URL}/api/auth/login`,
      loginDataFood,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Allow cookies to be sent from the backend
      }
    );

    document.cookie = `token2=${response2.data.token}; path=/; max-age=3600; SameSite=Lax`;

    return "Login Successful";
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw error;
      } else if (error.request) {
        throw new Error("No response from server. Please try again later.");
      }
    }
    // Handle any other type of error
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
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BUS_URL}/api/auth/register`,
      {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw error;
      } else if (error.request) {
        throw new Error("No response from server. Please try again later.");
      }
    }
    // Handle any other type of error
    throw new Error(`Unexpected error: ${(error as Error).message}`);
  }
};
