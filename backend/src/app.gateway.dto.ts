import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class userNameDto {
    @IsNotEmpty()
    @IsString()
    userName: string;
}

