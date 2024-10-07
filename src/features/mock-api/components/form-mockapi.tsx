"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

const requestSchema = z.object({
  headers: z.string(),
  body: z.string(),
  queryParams: z.string(),
});

const responseSchema = z.object({
  headers: z.string(),
  body: z.string(),
  status: z.number().int(),
});

const formSchema = z.object({
  method: z.enum(["POST", "GET", "PATCH", "PUT"]),
  endpoint: z.string().min(1, "Endpoint is required"),
  request: requestSchema,
  response: responseSchema,
  userId: z.string().uuid("Invalid UUID"),
});

type FormValues = z.infer<typeof formSchema>;

export default function MockApiForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      method: "GET",
      endpoint: "",
      request: {
        headers: "{}",
        body: "{}",
        queryParams: "{}",
      },
      response: {
        headers: "{}",
        body: "{}",
        status: 200,
      },
      userId: "",
    },
  });

  function onSubmit(values: FormValues) {
    const parsedValues = {
      ...values,
      request: {
        headers: JSON.parse(values.request.headers) as string,
        body: JSON.parse(values.request.body) as string,
        queryParams: JSON.parse(values.request.queryParams) as string,
      },
      response: {
        ...values.response,
        headers: JSON.parse(values.response.headers) as string,
        body: JSON.parse(values.response.body) as string,
      },
    };

    toast.success("Mock API created successfully!");

    // Here you would typically call your tRPC mutation with parsedValues
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the HTTP method for this mock API.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endpoint</FormLabel>
              <FormControl>
                <Input placeholder="/api/example" {...field} />
              </FormControl>
              <FormDescription>
                Enter the endpoint for this mock API.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="request.headers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request Headers</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='{"Content-Type": "application/json"}'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the request headers as a JSON string.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="request.body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request Body</FormLabel>
              <FormControl>
                <Textarea placeholder='{"key": "value"}' {...field} />
              </FormControl>
              <FormDescription>
                Enter the request body as a JSON string.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="request.queryParams"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Query Parameters</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='{"param1": "value1", "param2": "value2"}'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the query parameters as a JSON string.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="response.headers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Response Headers</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='{"Content-Type": "application/json"}'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the response headers as a JSON string.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="response.body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Response Body</FormLabel>
              <FormControl>
                <Textarea placeholder='{"key": "value"}' {...field} />
              </FormControl>
              <FormDescription>
                Enter the response body as a JSON string.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="response.status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Response Status</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              </FormControl>
              <FormDescription>
                Enter the HTTP status code for the response.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the UUID of the user creating this mock API.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Mock API</Button>
      </form>
    </Form>
  );
}
