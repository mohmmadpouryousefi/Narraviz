import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logInWithGitHub } from "@/app/auth/actions";

interface SocialLoginProps {
  mode: "login" | "signup";
  githubEnabled: boolean;
  callbackUrl?: string;
}

/** OAuth buttons; renders nothing when no provider is configured. */
export function SocialLogin({ mode, githubEnabled, callbackUrl = "/dashboard" }: SocialLoginProps) {
  if (!githubEnabled) return null;

  return (
    <div className="space-y-4">
      <form action={logInWithGitHub}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <Button
          type="submit"
          variant="outline"
          className="w-full h-12 bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-all duration-300"
        >
          <Github className="mr-2" aria-hidden />
          {mode === "login" ? "Sign in" : "Sign up"} with GitHub
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-black/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-muted-foreground rounded">or continue with email</span>
        </div>
      </div>
    </div>
  );
}
