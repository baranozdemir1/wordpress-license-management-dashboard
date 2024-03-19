"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";

import { Input } from "@nextui-org/react";
import { EmailIcon } from "@/components/icons/EmailIcon";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { signIn } from "@/app/actions";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSignIn = () => {
    startTransition(async () => {
      const { data, error } = await signIn({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      }
    });
  };

  return (
    <div className={"grid gap-6"} {...props}>
      <form>
        <div className="grid gap-5">
          <div className="grid gap-2">
            <div className="grid gap-2">
              <Input
                type="email"
                label="Email"
                variant="bordered"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                endContent={
                  <EmailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
              />
            </div>
            <div className="grid gap-2">
              {/* <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={isLoading}
              /> */}
              <Input
                label="Password"
                variant="bordered"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
              />
            </div>
          </div>
          <Button
            isDisabled={isPending}
            onClick={handleSignIn}
            color="primary"
            isLoading={isPending}
          >
            {isPending ? "Please wait..." : "Sign In"}
          </Button>
        </div>
      </form>
    </div>
  );
}
