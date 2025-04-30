import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { SocialLogins } from "@/components/auth/SocialLogins";
import { Divider } from "@/components/auth/Divider";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an Account"
      description="Sign up to get started."
    >
      <RegisterForm />
      <Divider text="OR SIGN UP WITH" />
      <SocialLogins />
       <div className="mt-6 text-center text-sm">
         Already have an account?{" "}
         <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary">
           <Link href="/auth/login">
             Log in
           </Link>
         </Button>
       </div>
    </AuthLayout>
  );
}
