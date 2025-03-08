import { Resend } from "resend";

import { badRequest } from "@hapi/boom";

const resend = new Resend("re_HVcvhkcK_Pki23QeN2uJT41CiqdnxiRfu");

export const sendEmail = async (email: string) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [],
    subject: "hello world",
    html: "<strong>it works!</strong>",
  });

  if (error) {
    throw badRequest(error);
  }

  return data;
};
