"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { ImageIcon } from "lucide-react";
import * as z from "zod";
import { formSchema, resolutionOptions } from "./constants";
import axios, { all } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import Heading from "@/components/heading";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Image() {
  const router = useRouter();
  const [imageURL, setImageURL] = useState<string | null>(null);
  // const messagesStartRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      resolution: "256",
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
      setImageURL(null);
      const response = await axios.post("/api/image", values, {
        responseType: "blob",
      });
      const imageBlob = await response.data;
      console.log(imageBlob, imageBlob.type);
      const url = URL.createObjectURL(imageBlob);
      setImageURL(url);
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
        title="Image Generation"
        description="Turn your prompts into images."
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
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
                  <FormItem className="col-span-12 lg:col-span-8">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="A picture of a horse in Swiss alps"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            <div className="p-20">
              <Loader />
            </div>
          )}
          {!imageURL && !isLoading && <Empty label="No images generated" />}
          {imageURL && (
            <img
              src={imageURL}
              alt="Generated"
              className="rounded-lg shadow-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
}
