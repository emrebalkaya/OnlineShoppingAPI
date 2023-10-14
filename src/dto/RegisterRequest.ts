import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class RegisterRequest {
    @IsEmail({}, { message: "Email must be a valid email address" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @IsNotEmpty({ message: "Password is required" })
    @Length(5,20)
    password: string;

    @IsNotEmpty({ message: "First name is required" })
    firstName: string;

    @IsNotEmpty({ message: "Last name is required" })
    lastName: string;
}
