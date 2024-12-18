"use client";

import { useState } from "react";
import ApiRequests from "@/app/api-requests";
import Form from "next/form";
import {permanentRedirect} from "next/navigation";
import Image from "next/image";

export default function Register() {
  const [form, setForm] = useState({username: "", password: ""});
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleRegister = async () => {
    const response = await ApiRequests.attemptRegister(form.username, form.password);
    if (response) {
      setIsLogin(true);
      return;
    }
    setMessage("Username already exists");
  }

  const handleLogin = async () => {
    const token = await ApiRequests.attemptLogin(form.username, form.password);
    if (token !== "Unauthorized") {
      localStorage.setItem("token", token);
      permanentRedirect("/profile");
    }
    setMessage("Invalid credentials.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen select-none">
      <Image src="/main-sheet/Proficiencies.svg" alt="Proficiencies" width={0} height={0}
             priority={true} className="object-contain w-[500px] h-auto"
      />
      <div className="w-full max-w-md p-8 space-y-4 rounded absolute">
        <Form action={isLogin ? handleLogin : handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input type="text" placeholder="Username" required
                   onChange={(e) => setForm({...form, username: e.target.value})}
                   className="w-full p-2 mt-1 border border-primary bg-background rounded-md outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" placeholder="Password" required
                   onChange={(e) => setForm({...form, password: e.target.value})}
                   className="w-full p-2 mt-1 border border-primary bg-background rounded-md outline-none"
            />
          </div>
          <div className="flex flex-row items-center justify-center">
            <button type="submit" className="p-2 rounded-md">
              {isLogin ? "Login" : "Register"}
            </button>
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="p-2 rounded-md">
              <Image src="/archive-register.svg" alt="archive-register" width={30} height={30}/>
            </button>
          </div>
        </Form>
        {message && <p className="absolute inset-x-0 text-secondary text-center">{message}</p>}
      </div>
    </div>
  );
}