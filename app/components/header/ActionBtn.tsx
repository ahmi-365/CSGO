// app/components/header/ActionBtn.tsx

"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Input from "@/app/components/ui/Input";
import { FaTimes } from "react-icons/fa";
import { loginUser } from "@/app/services/api";

interface BtnItem {
  name?: string;
}

type Props = {};

export default function ActionBtn({}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [loginModal, setLoginModal] = useState(false);
  const btns: BtnItem[] = [{ name: "in" }, { name: "up" }];
  const [activeTab, setActiveTab] = useState<BtnItem>(btns[0]);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [code, setCode] = useState<string>(""); // Yeh field optional ho sakti hai
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const setParams = (item: BtnItem) => {
    if (!item.name) return;

    const params = new URLSearchParams(searchParams.toString());
    const createRoute = item.name.toLowerCase().trim();
    params.set("auth", createRoute);
    params.delete("type");

    router.push(`${pathname}?${params.toString()}`);
    setActiveTab(item);
    setLoginModal(true);
  };

  useEffect(() => {
    const currentAuth = searchParams.get("auth") || "";
    const found =
      btns.find(
        (item) => item.name?.toLowerCase() === currentAuth.toLowerCase()
      ) || btns[0];
    setActiveTab(found);

    if (loginModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [searchParams, loginModal]);

  const siteLogin = async (event: FormEvent) => {
    event.preventDefault(); // Form ko submit hone se rokein

    if (!email || !password) {
      setApiError("Email aur password dono zaroori hain.");
      return;
    }

    setApiError(null);
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);

      if (data && data.token) {
        console.log("Login kamyab:", data);

        // Token ko cookie mein save karein
        document.cookie = `auth_token=${data.token}; path=/; max-age=86400; SameSite=Lax`; // 24 hours

        setLoginModal(false);
        const params = new URLSearchParams(searchParams.toString());
        params.delete("auth");
        router.push(`${pathname}?${params.toString()}`);
        
        // Page ko refresh karein taake nayi state load ho (optional lekin behtar hai)
        router.refresh();

        if (data.isAdmin) {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      setApiError(error.message || "Email ya Password ghalat hai.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 ml-auto lg:ml-0">
        {btns.map((item, index) => (
          <button
            onClick={() => setParams(item)}
            className={`btn ${index === 0 ? "gradient-border" : ""}`}
            key={index}
          >
            <span className="-translate-y-px capitalize">Sign {item.name}</span>
          </button>
        ))}
      </div>
      {loginModal && (
        <div className="fixed size-full inset-0 bg-[#171925]/60 px-3 py-6 flex items-center justify-center z-50">
          <div className="w-full max-w-lg mx-auto bg-[#D7DEFF]/15 border border-solid border-[#D7DEFF]/10 backdrop-blur-[20px] flex flex-col-reverse md:flex-row flex-wrap rounded-2xl overflow-hidden">
            <div className="w-full md:w-1/2 py-9 px-6">
              <div className="flex items-center border-b border-solid border-white/12 mb-5">
                {btns.map((item, index) => (
                  <button
                    onClick={() => setActiveTab(item)}
                    className={`block border-b-2 border-solid p-4 pt-0 font-inter font-semibold -mb-px ${
                      item.name === activeTab.name
                        ? "text-white border-white"
                        : "text-white/50 border-transparent"
                    }`}
                    key={index}
                  >
                    Sign {item.name}
                  </button>
                ))}
              </div>
              {activeTab.name === "in" && (
                <form onSubmit={siteLogin} className="flex flex-col gap-y-4">
                  <Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address..." required />
                  <Input type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password..." required />
                  <Input type="text" label="Code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code..." />
                  
                  {apiError && <p className="text-red-500 text-sm text-center">{apiError}</p>}
                  
                  <button type="submit" className="btn font-inter font-bold" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
              )}
              {activeTab.name === "up" && (
                <div className="flex flex-col gap-y-4">
                  {/* Signup form */}
                  <Input type="text" label="Username" placeholder="Enter your username..." required />
                  <Input type="email" label="Email" placeholder="Enter your email address..." required />
                  <Input type="password" label="Password" placeholder="Enter your password..." required />
                  <Input type="text" label="Code" placeholder="Enter code..." required />
                  <button className="btn font-inter font-bold">Signup</button>
                </div>
              )}
            </div>
            <div className="w-full md:w-1/2 bg-[#171925]/30 relative z-10 flex items-center justify-center md:py-6 min-h-[150px] md:min-h-0">
              <button onClick={() => setLoginModal(false)} className="text-white/50 hover:text-white text-base absolute top-5 right-5 p-1 -m-1">
                <FaTimes />
              </button>
              {/* SVG Code... */}
              <svg className="hidden md:block" width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="48.688" width="83.1028" height="83.1028" rx="30.2192" fill="#20222E"/><path d="M112.183 39.1306C112.825 39.1313 113.346 39.6526 113.345 40.2951L113.33 60.084C113.327 63.4102 110.631 66.1041 107.305 66.1044H73.4529C70.125 66.104 67.4281 63.4074 67.4279 60.0795V40.2931C67.4279 39.6505 67.9489 39.1295 68.5915 39.1295H70.7666C71.4092 39.1295 71.9302 39.6505 71.9302 40.2931V60.0795C71.9304 60.9199 72.6125 61.6018 73.4529 61.6022H107.305C108.145 61.6019 108.827 60.9198 108.828 60.0795L108.841 40.2913C108.841 39.6485 109.363 39.1278 110.005 39.1284L112.183 39.1306ZM108.376 18.0137C110.079 18.0137 111.609 19.0569 112.23 20.6432L115.598 29.2477C116.467 31.4672 114.829 33.8659 112.446 33.8659H105.362C104.72 33.8659 104.199 33.3449 104.199 32.7023V30.525C104.199 29.8823 104.72 29.3614 105.362 29.3614H110.805L108.128 22.5159H72.3415L69.6643 29.3614H75.108C75.7506 29.3614 76.2716 29.8823 76.2716 30.525V32.7023C76.2716 33.3449 75.7506 33.8659 75.108 33.8659H68.0234C65.64 33.8659 64.0027 31.4672 64.8711 29.2477L68.2393 20.6432C68.8604 19.0569 70.3902 18.0137 72.0938 18.0137H108.376Z" fill="url(#paint0_linear_216_1432)"/><path d="M89.1867 28.0709C89.528 27.0714 90.9415 27.0714 91.2828 28.0709L93.0192 33.1557C93.13 33.4802 93.3849 33.735 93.7094 33.8458L98.7942 35.5822C99.7937 35.9235 99.7936 37.3371 98.7942 37.6783L93.7094 39.4147C93.3849 39.5256 93.13 39.7804 93.0192 40.1049L91.2828 45.1897C90.9415 46.1892 89.528 46.1892 89.1867 45.1897L87.4503 40.1049C87.3395 39.7804 87.0847 39.5256 86.7602 39.4147L81.6754 37.6783C80.6759 37.3371 80.6759 35.9235 81.6754 35.5822L86.7602 33.8458C87.0847 33.735 87.3395 33.4802 87.4503 33.1557L89.1867 28.0709Z" fill="white"/><path d="M77.788 47.5659C76.9146 48.2556 76.6641 49.489 77.305 50.3988C78.6892 52.3637 80.3854 54.0007 82.3041 55.2144C84.7326 56.7504 87.4435 57.5613 90.1995 57.576C92.9555 57.5907 95.6725 56.8088 98.1127 55.2988C100.04 54.1062 101.748 52.4882 103.147 50.5393C103.796 49.6348 103.556 48.3987 102.689 47.7004C101.612 46.8331 100.025 47.1448 99.1272 48.1966C98.2411 49.2351 97.2253 50.1155 96.1112 50.8049C94.2942 51.9293 92.2711 52.5115 90.219 52.5006C88.1668 52.4896 86.1483 51.8858 84.34 50.7421C83.2285 50.0391 82.2174 49.1452 81.3378 48.094C80.4523 47.0358 78.8709 46.7106 77.788 47.5659Z" fill="white"/><path d="M15.2445 136.405C7.46303 136.405 2.28799 130.815 2.28799 122.353C2.28799 113.93 7.61413 108.226 15.4333 108.226C21.5905 108.226 26.3123 111.89 27.3322 117.48H23.3659C22.346 113.93 19.2863 111.777 15.32 111.777C9.80502 111.777 6.17872 115.932 6.17872 122.316C6.17872 128.699 9.80502 132.855 15.32 132.855C19.3241 132.855 22.4971 130.701 23.517 127.339H27.4455C26.2745 132.779 21.4016 136.405 15.2445 136.405ZM34.822 135.99H31.2713V108.188H34.822V135.99ZM48.0193 136.443C42.5799 136.443 38.8402 132.515 38.8402 126.773C38.8402 120.993 42.5043 116.989 47.8682 116.989C53.1188 116.989 56.5563 120.616 56.5563 126.093V127.415L42.2777 127.453C42.5421 131.344 44.5819 133.497 48.0949 133.497C50.8524 133.497 52.6655 132.363 53.2699 130.248H56.594C55.6875 134.214 52.59 136.443 48.0193 136.443ZM47.8682 119.974C44.7708 119.974 42.8065 121.824 42.3532 125.073H53.0055C53.0055 122.013 51.0035 119.974 47.8682 119.974ZM65.7395 136.443C61.7732 136.443 59.4312 134.214 59.4312 130.852C59.4312 127.453 61.9621 125.337 66.3061 124.998L72.1233 124.544V124.015C72.1233 120.918 70.2724 119.822 67.7793 119.822C64.7951 119.822 63.0953 121.145 63.0953 123.373H59.9978C59.9978 119.52 63.1708 116.989 67.9304 116.989C72.501 116.989 75.5985 119.407 75.5985 124.393V135.99H72.5766L72.1988 133.006C71.2545 135.121 68.7236 136.443 65.7395 136.443ZM66.7594 133.686C70.1213 133.686 72.1611 131.495 72.1611 128.019V127.037L67.4393 127.415C64.3041 127.717 63.0197 128.926 63.0197 130.739C63.0197 132.703 64.4552 133.686 66.7594 133.686ZM84.0667 135.99H80.5159V117.518H83.7267L84.1044 120.351C85.2754 118.236 87.6174 116.989 90.2238 116.989C95.0967 116.989 97.3253 119.974 97.3253 124.695V135.99H93.7746V125.489C93.7746 121.749 92.037 120.238 89.3172 120.238C85.9931 120.238 84.0667 122.618 84.0667 126.206V135.99Z" fill="white"/><path d="M112.858 136.405C106.361 136.405 102.017 131.646 102.017 124.506C102.017 115.403 107.947 108.717 115.993 108.717C121.47 108.717 125.701 112.305 126.079 117.216H124.341C123.812 113.136 120.45 110.341 115.993 110.341C108.892 110.341 103.754 116.309 103.754 124.506C103.754 130.739 107.305 134.743 112.896 134.743C117.466 134.743 120.677 132.666 122.717 128.322H124.643C122.377 133.686 118.411 136.405 112.858 136.405ZM132.397 136.443C129.224 136.443 127.146 134.554 127.146 131.684C127.146 128.095 129.979 125.753 134.777 125.375L140.934 124.884L141.047 124.318C141.727 120.88 140.103 118.954 136.552 118.954C133.228 118.954 131.302 120.389 130.811 123.222H129.111C129.677 119.558 132.473 117.405 136.59 117.405C141.01 117.405 143.427 119.936 142.785 123.94L140.896 135.99H139.499L139.763 132.59C138.214 135.008 135.457 136.443 132.397 136.443ZM132.775 134.932C136.854 134.932 139.876 131.986 140.594 127.302L140.745 126.32L134.663 126.811C130.962 127.113 128.808 128.926 128.808 131.684C128.808 133.648 130.357 134.932 132.775 134.932ZM145.465 131.268H147.165C147.165 133.421 149.016 134.932 151.66 134.932C154.531 134.932 156.495 133.421 156.495 131.192C156.495 129.568 155.777 128.699 153.851 128.019L150.98 127C148.449 126.093 147.203 124.582 147.203 122.353C147.203 119.445 149.734 117.405 153.36 117.405C157.062 117.405 159.215 119.369 159.215 122.693H157.515C157.402 120.087 156.08 118.916 153.284 118.916C150.64 118.916 148.865 120.276 148.865 122.353C148.865 123.94 149.696 124.922 151.584 125.602L154.418 126.622C157.062 127.566 158.157 128.888 158.157 131.192C158.157 134.252 155.437 136.443 151.66 136.443C148.034 136.443 145.465 134.29 145.465 131.268ZM169.418 136.443C165.036 136.443 161.901 133.081 161.901 128.397C161.901 122.202 166.056 117.405 171.42 117.405C176.217 117.405 179.126 121.069 178.37 125.753L178.181 126.924H163.638C163.601 127.415 163.563 127.906 163.563 128.397C163.563 132.288 165.943 134.932 169.418 134.932C172.327 134.932 174.895 133.383 175.84 130.815H177.539C176.331 134.365 173.158 136.443 169.418 136.443ZM171.42 118.916C167.831 118.916 164.885 121.673 163.903 125.564H176.708C177.35 121.56 175.084 118.916 171.42 118.916Z" fill="#CECFD9"/><defs><linearGradient id="paint0_linear_216_1432" x1="70.4534" y1="18.0137" x2="112.344" y2="64.559" gradientUnits="userSpaceOnUse"><stop offset="0.117811" stopColor="#FCC811"/><stop offset="0.40485" stopColor="#F85D36"/><stop offset="0.564146" stopColor="#EF5180"/><stop offset="0.857068" stopColor="#4B71FF"/><stop offset="1" stopColor="#34DDFF"/></linearGradient></defs></svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
}