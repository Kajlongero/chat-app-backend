import { badRequest } from "@hapi/boom";
import { SendMailOptions, createTransport } from "nodemailer";

import { mailConfigs } from "../../configs";
import { CommonsResponses } from "../../responses/commons.responses";

export const sendMail = async (email: string, template: string) => {
  try {
    let transporter = createTransport({
      host: mailConfigs.MAIL_HOST as string,
      port: parseInt(mailConfigs.MAIL_PORT as string),
      secure: true,
      auth: {
        user: mailConfigs.MAIL_FROM,
        pass: mailConfigs.MAIL_PASS,
      },
    });

    const opts: SendMailOptions = {
      from: mailConfigs.MAIL_FROM,
      to: email,
      subject: "KajloChat | Reset your password",
      text: "Password recovery",
      html: template,
    };

    const res = await transporter.sendMail(opts);
    return res;
  } catch (error) {
    console.error(error);
    throw badRequest(CommonsResponses.en[400].generic);
  }
};
