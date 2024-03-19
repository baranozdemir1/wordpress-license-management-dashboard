import { UserAuthForm } from "@/components/login/UserAuthForm";
import Image from "next/image";
import { redirect } from "next/navigation";
import { readUserSession } from "./actions";

export default async function Home() {
  const { data } = await readUserSession();

  if (data.session) {
    return redirect("/dashboard");
  }

  return (
    <>
      <div className="container relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative flex h-full flex-col bg-muted p-10 text-white dark:border-r ">
          <div className="absolute inset-0 bg-gradient-brand" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Image src="/logo.svg" alt="Logo" width={60} height={60} />
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to login your account
              </p>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  );
}
