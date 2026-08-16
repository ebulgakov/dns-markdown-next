import { sendGAEvent as sendGAEventOriginal } from "@next/third-parties/google";

type GAEvent = {
  event: string;
  value?: number | string;
  category?: string;
  action?: string;
};

export const sendGAEvent = ({ event, ...props }: GAEvent) => {
  sendGAEventOriginal("event", event, props);
};
