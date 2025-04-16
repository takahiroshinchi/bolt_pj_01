"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />;
  }

  return (
    <div className="flex items-center space-x-4">
      <SignUpButton mode="modal">
        <Button variant="outline">新規登録</Button>
      </SignUpButton>
      <SignInButton mode="modal">
        <Button>ログイン</Button>
      </SignInButton>
    </div>
  );
}