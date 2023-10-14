import { IsEmail, IsNotEmpty, Length, Min } from "class-validator";

export class LoginRequest {
    @IsEmail({}, { message: "Email must be a valid email address" })
    @IsNotEmpty({ message: "Password is required" })
    email: string;

    @IsNotEmpty({ message: "Password is required" })
    @Length(5,20)
    password: string;
}
