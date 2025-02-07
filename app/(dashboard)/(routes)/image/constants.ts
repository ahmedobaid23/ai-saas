import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Image prompt is required",
  }),
  amount: z.string().min(1),
});

export const amountOptions = [
  { label: "1 Photo", value: "1" },
  { label: "2 Photos", value: "2" },
  { label: "3 Photos", value: "3" },
  { label: "4 Photos", value: "4" },
];
