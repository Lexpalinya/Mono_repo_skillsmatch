import { zodResolver } from "@hookform/resolvers/zod";
import { MemberLoginDtoType, type IMemberLoginDtoType } from "@skillsmatch/dto";
import { Button, Card, CardContent, cn, confirm, Form } from "@skillsmatch/ui";
import { Link, useNavigate } from "@tanstack/react-router";

import { CheckCircle } from "lucide-react";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const nav = useNavigate();
  const form = useForm<IMemberLoginDtoType>({
    defaultValues: {
      phoneNumber: "+8562012345678",
      password: "password",
    },
    resolver: zodResolver(MemberLoginDtoType),
  });

  const login = async (dataInput: IMemberLoginDtoType) => {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dataInput),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message ?? "Login failed");
    }

    return data;
  };
  const onSubmit = async () => {
    try {
      await login(form.watch());
      nav({ to: "/app" });

      toast.success("Course created successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the course. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Create Course",
        description: errorMessage,
        CancelProps: { className: "hidden" },
      });
    }
  };
  return (
    <div className={cn("flex flex-col gap-6")} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form
            showButton={false}
            className="p-6 md:p-8"
            formInstance={form} // Replace with a valid form instance
            onSubmit={() => onSubmit()}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Acme Inc account
                </p>
              </div>

              <Form.Field
                name="phoneNumber"
                label="Phone Number"
                defaultValue={"+8562012345678"}
              >
                <Form.InputGroup.Input placeholder="+8562012345678 " />
              </Form.Field>

              <Form.Field
                name="password"
                label="Password"
                defaultValue={"password"}
              >
                <Form.InputGroup.PasswordInput />
              </Form.Field>
            </div>
            <div className="flex items-center ">
              <Link
                to={"auth/forgot-password"}
                className="ml-auto text-sm underline-offset-2 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Button className="w-full mt-3">Login</Button>
          </Form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="../../../../../vite.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
