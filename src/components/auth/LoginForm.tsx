import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SocialLogin } from "./SocialLogin";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Logging attemt:", { email, password });
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-data-primary to-data-secondary bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Sign in to continue your data storytelling journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <SocialLogin mode="login" />
          
        </CardContent>
      </Card>
    </div>
  );
}
