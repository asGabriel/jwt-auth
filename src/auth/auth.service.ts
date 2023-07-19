import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { jwtConstants } from 'src/constants/jwt-secret';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { SignInDto } from './dto/sign-in.dto';
import { TokenVerifyDto } from './dto/token-verify.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) { }

    async signIn(data: SignInDto) {
        const user = await this.prisma.user.findFirst({ where: { email: data.email } })
        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException;
        }

        const payload = { email: user.email };
        return {
            status: HttpStatus.CREATED,
            access_token: await this.jwt.signAsync(payload, { secret: jwtConstants.secret }),
        };
    }

    async verifyToken(bearerToken: string): Promise<TokenVerifyDto> {
        try {
            const token = bearerToken.replace('Bearer ', '');
            const verifiedToken = await this.jwt.verify(token);
            const { email, username } = verifiedToken as { email: string; username: string };
            return { email, username };
        } catch (error) {
            throw new UnauthorizedException;
        }
    }

    async signOut(bearerToken: string) {
        const invalidToken = this.prisma.invalidToken.create({
            data: {
                invalidtoken: bearerToken
            }
        })

        if (!invalidToken) throw new BadRequestException();

        return { message: "Token has been invalidated.", status: HttpStatus.ACCEPTED };
    }

}