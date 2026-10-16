import { Resend } from "resend";

import { env } from "#env.ts";

const resend = new Resend(env.RESEND_API_KEY);

export default resend;
