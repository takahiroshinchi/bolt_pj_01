import { SignInButton as ClerkSignInButton } from "@clerk/nextjs";

export const SignInButton = () => {
  return (
    <ClerkSignInButton mode="modal">
      <span className="cursor-pointer">サインイン</span>
    </ClerkSignInButton>
  );
}; 