import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Image prompt is required",
  }),
  resolution: z.string().min(1)
});

export const resolutionOptions = [
  { label: "256x256", value: "256" },
  { label: "512x512", value: "512" },
  { label: "1024x1024", value: "1024" },
  { label: "2048x2048", value: "2048" },
];
