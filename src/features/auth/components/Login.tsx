"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "../dto/auth.dto";
import { type z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { api } from "@/trpc/react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image.";

export default function LoginForm() {
  const router = useRouter();

  const { mutateAsync, isPending } = api.auth.login.useMutation({
    onSuccess: (data) => {
      if (data.status && data.data?.subdomain) {
        const subdomain = data.data.subdomain;
        const baseUrl = window.location.hostname.split(".").slice(-2).join(".");
        const newUrl = `${process.env.NODE_ENV === "development" ? `http://${subdomain}.${baseUrl}:3000/dashboard` : `https://${subdomain}.${baseUrl}/dashboard`}`;
        window.location.href = newUrl;
      } else {
        // Handle error atau tampilkan pesan jika login gagal
        console.error("Login failed or subdomain not provided");
      }
    },
  });
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    try {
      const response = await mutateAsync(values);
      if (response.status) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="example@ex.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="mt-2 w-full"
                    disabled={isPending}
                  >
                    Login
                  </Button>
                  <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline">
                      Sign up
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <HeroHighlight className="hidden lg:block">
        <h1 className="text-3xl font-bold text-neutral-800 underline underline-offset-4 drop-shadow">
          <Highlight> NoWaitAPI</Highlight>
        </h1>
      </HeroHighlight>
    </div>
  );
}
