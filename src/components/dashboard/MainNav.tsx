"use client";

import { Navbar, NavbarBrand, NavbarContent, Button } from "@nextui-org/react";
import Image from "next/image";
import { LogoutIcon } from "../icons/LogoutIcon";
import { useRouter } from "next/navigation";
import { signOut } from "@/app/actions";
import { User } from "@supabase/supabase-js";

interface Props {
  user: User;
}

export default function MainNav({ user }: Props) {
  const router = useRouter();

  const logoutHandler = async () => {
    const { error } = await signOut();
    if (error) {
      console.log(error);
    } else {
      router.refresh();
      return;
    }
  };

  return (
    <Navbar maxWidth="full" isBordered>
      <NavbarContent justify="start">
        <NavbarBrand>
          <Image src="/logo.svg" alt="ACME Logo" width="50" height="50" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="center">
        <NavbarBrand>
          <p className="font-normal text-center mx-5">
            WordPress Theme License Management System
          </p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <div>
          <p className="font-semibold text-xs">Signed in as</p>
          <p className="font-normal text-sm">{user.email}</p>
        </div>
        <Button
          onClick={logoutHandler}
          variant="bordered"
          isIconOnly
          color="danger"
          aria-label="Logout"
        >
          <LogoutIcon size={20} />
        </Button>
      </NavbarContent>
    </Navbar>
  );
}
