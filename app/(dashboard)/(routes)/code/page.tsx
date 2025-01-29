"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Code } from "lucide-react";
import * as z from "zod";
import { formSchema } from "./constants";
import axios, { all } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import Heading from "@/components/heading";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

import { v4 as uuidv4 } from "uuid";

interface Parts {
  text: string;
}

interface Message {
  role: "user" | "model";
  parts: Parts[];
}

export default function CodeGeneration() {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  // const messagesStartRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  // useEffect(() => {
  //   if (messagesStartRef.current) {
  //     messagesStartRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: Message = {
        role: "user",
        parts: [{ text: values.prompt }],
      };

      const response = await axios.post("/api/code", {
        messages,
        userMessage: userMessage.parts[0].text,
      });
      setMessages((current) => [...current, userMessage, response.data]);
      form.reset();
    } catch (error: any) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate code using descriptive prompts."
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      />
      <div className="px-4 pb-4 lg:px-8 lg:pb-8">
        <div className="sticky top-0 bg-white z-10 transition-all py-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2 shadow-lg"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Simple toggle button using react hooks."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4">
          {isLoading && (
            <div className="rounded-lg p-8 w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation yet" />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages
              .slice()
              .reverse()
              .map((message) => {
                const uniqueKey = uuidv4();
                return (
                  <div
                    key={uniqueKey}
                    className={cn(
                      "p-8 w-full flex items-start gap-x-4 rounded-lg",
                      message.role === "user"
                        ? "bg-white border border-black/10"
                        : "bg-muted"
                    )}
                  >
                    {/* <div ref={messagesStartRef} /> */}
                    {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                    <ReactMarkdown
                      className="text-sm overflow-hidden leading-7"
                      components={{
                        pre: ({ node, ...props }) => (
                          <pre
                            className="w-full my-2 bg-black/10 p-2 rounded-lg overflow-auto"
                            {...props}
                          />
                        ),
                        code: ({ node, ...props }) => (
                          <code
                            className="bg-black/10 p-1 rounded-lg"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {message.parts[0].text}
                    </ReactMarkdown>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
