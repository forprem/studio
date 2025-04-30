import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { SocialLogins } from "@/components/auth/SocialLogins";
import { Divider } from "@/components/auth/Divider";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back!"
      description="Log in to your account to continue."
    >
      <LoginForm />
      <Divider text="OR CONTINUE WITH" />
      <SocialLogins />
      <div className="mt-6 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary">
          <Link href="/auth/register">
           Sign up
          </Link>
        </Button>
      </div>
    </AuthLayout>
  );
}
