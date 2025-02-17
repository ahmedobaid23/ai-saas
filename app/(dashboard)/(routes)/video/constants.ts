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
  { label: "Zoom in", value: "zoom-in" },
  { label: "Zoom out", value: "zoom-out" },
  { label: "Tilt up", value: "tilt-up" },
  { label: "Tilt down", value: "tilt-down" },
  { label: "Pan left", value: "pan-left" },
  { label: "Pan right", value: "pan-right" },
  { label: "Roll left", value: "rolling-anticlockwise" },
  { label: "Roll clockwise", value: "rolling-clockwise" },
];
