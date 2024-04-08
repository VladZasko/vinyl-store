import nodemailer from "nodemailer";
import {UpdateUserModel} from "../models/input/UpdateUserModel";
import {UserViewModel} from "../models/output/UserViewModel";
import {settings} from "../../../settings";

export const emailAdapter = {
    async sendNotification(user: UserViewModel, updateData:UpdateUserModel):Promise<boolean> {
        const transport = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: settings.AUTH_MAILER.USER,
                pass: settings.AUTH_MAILER.PASS,
            },
        });

        await transport.sendMail({
            from: "Vlad Zasko <uladzislauzasko@gmail.com>",
            to: user.email,
            subject: "Changed profile",
            html: ' <h1>Your profile information has been successfully changed</h1>\n' +
                 `<p> You have changed your last name and first name to: ${updateData.lastName} ${updateData.firstName}`
        });
        return true
    }
}