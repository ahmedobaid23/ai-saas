import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Image prompt is required",
  }),
  amount: z.string().min(1),
  aspectRatio: z.string().min(1),
});

export const amountOptions = [
  { label: "1 Photo", value: "1" },
  { label: "2 Photos", value: "2" },
  { label: "3 Photos", value: "3" },
  { label: "4 Photos", value: "4" },
  { label: "5 Photos", value: "5" },
];

export const aspectRatioOptions = [
  { label: "1:1", value: "1:1" },
  { label: "3:4", value: "3:4" },
  { label: "4:3", value: "4:3" },
  { label: "9:16", value: "9:16" },
  { label: "16:9", value: "16:9" },
];
