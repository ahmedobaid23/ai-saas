import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required",
  }),
  type: z.string().min(1),
  motion: z.string().min(1),
});

export const typeOptions = [
  { label: "ToonYou", value: "ToonYou" },
  { label: "epiCRealism", value: "epiCRealism" },
];

export const motionOptions = [
  { label: "Zoom in", value: "Zoom in" },
  { label: "Zoom out", value: "Zoom out" },
  { label: "Tilt up", value: "Tilt up" },
  { label: "Tilt down", value: "Tilt down" },
  { label: "Pan left", value: "Pan left" },
  { label: "Pan right", value: "Pan right" },
  { label: "Roll left", value: "Roll left" },
  { label: "Roll right", value: "Roll right" },
];
