import { useMutation } from "@tanstack/react-query";
import { signUp as signupApi } from "../../services/apiAuth"; // Import the correct function
import { toast } from "react-hot-toast";

export function useSignup() {
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signupApi, // Reference the correct signupApi
    onSuccess: () => {
      toast.success(
        "Account successfully created! Please verify the new account from the user's email address."
      );
    },
    onError: (error) =>
      toast.error(error.message || "An error occurred during registration"),
  });

  return { signup, isLoading }; // Return both signup and loading state
}
