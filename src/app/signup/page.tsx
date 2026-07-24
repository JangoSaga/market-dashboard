import Link from "next/link";

import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-lg font-bold tracking-tight text-white">
            Market<span className="text-emerald-500">Pulse</span>
          </Link>
          <h1 className="mt-6 text-xl font-semibold text-zinc-100">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Start with a ₹1,00,000 virtual balance. No real money involved.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6">
          <AuthForm mode="signup" />
        </div>
      </div>
    </div>
  );
}
