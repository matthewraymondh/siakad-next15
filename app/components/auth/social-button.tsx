import { signIn } from "@/auth";
import { IoLogoGoogle } from "react-icons/io5";

export const GoogleButton = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/dashboard" });
      }}
    >
      <button
        type="submit"
        className="flex items-center justify-center gap-1 py-2.5 rounded-lg uppercase text-white font-medium text-sm bg-congress-blue-500 w-full"
      >
        <IoLogoGoogle />
        Sign In with Google
      </button>
    </form>
  );
};
