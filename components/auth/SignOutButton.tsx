import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";

export const SignOutButton = () => {
  return (
    <ClerkSignOutButton>
      <span className="cursor-pointer">サインアウト</span>
    </ClerkSignOutButton>
  );
}; 