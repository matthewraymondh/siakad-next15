"use client";

import { useFormStatus } from "react-dom";

export const LoginButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full text-white bg-congress-blue-500 font-medium rounded-lg px-5 py-5 text-center uppercase hover:bg-congress-blue-600"
    >
      {pending ? "Authenticating..." : "Login"}
    </button>
  );
};

export const RegisterButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full text-white bg-congress-blue-500 font-medium rounded-lg px-5 py-5 text-center uppercase hover:bg-congress-blue-600"
    >
      {pending ? "Loading..." : "Register"}
    </button>
  );
};
