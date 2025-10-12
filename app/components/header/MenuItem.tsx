"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { MdOutlineClose } from "react-icons/md";
import UserCurrency from "./UserCurrency";

type Props = {};

interface MenuItem {
  name: string;
  path: string;
}
export default function MenuItem({}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const menus: MenuItem[] = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Inventory",
      path: "/?type=inventory",
    },
    {
      name: "Gift Card",
      path: "/gift-card",
    },
    {
      name: "Support",
      path: "/support",
    },
  ];
  const [isMobile, setIsMobile] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentParams = searchParams.get("mobile_menu");
    setIsMobile(currentParams === "true");
  }, [searchParams]);

  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    const handleCookieChange = (event: any) => {
      const changed = event.changed.find((c: any) => c.name === "auth");
      const deleted = event.deleted.find((c: any) => c.name === "auth");

      if (changed) {
        setIsAuth(changed.value === "true");
      } else if (deleted) {
        setIsAuth(false);
      }
    };

    if ("cookieStore" in window) {
      window.cookieStore.addEventListener("change", handleCookieChange);
      window.cookieStore.get("auth").then((cookie) => {
        setIsAuth(cookie?.value === "true");
      });
    } else {
      setIsAuth(document.cookie.includes("auth=true"));
    }

    return () => {
      if ("cookieStore" in window) {
        window.cookieStore.removeEventListener("change", handleCookieChange);
      }
    };
  }, []);

  const setParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mobile_menu", "false");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className={`${
        pathname.includes("/dashboard") ? "hidden lg:flex" : ""
      } absolute transition-all duration-300 top-full bg-primary/80 w-full ${
        isMobile
          ? "scale-y-100 opacity-100 visible"
          : "scale-y-50 opacity-0 invisible"
      } right-0 p-4 backdrop-blur-lg xl:backdrop-blur-none xl:w-max xl:relative xl:top-0 xl:bg-transparent xl:p-0 xl:opacity-100 xl:visible xl:scale-y-100 flex flex-col xl:flex-row xl:items-center gap-4 md:gap-6 xl:gap-9`}
    >
      <button
        onClick={() => setParams()}
        className="absolute text-xl top-0 right-0 m-2 size-6 xl:hidden flex items-center justify-center text-white"
      >
        <MdOutlineClose />
      </button>
      {menus.map((item, index) => (
        <Link
          href={item.path}
          className={`block text-sm !leading-tight hover:text-white font-medium ${
            pathname === item.path ? "text-white" : "text-white/40"
          }`}
          key={index}
        >
          {item.name}
        </Link>
      ))}
      {isAuth && <UserCurrency className="flex lg:hidden" />}
    </div>
  );
}
