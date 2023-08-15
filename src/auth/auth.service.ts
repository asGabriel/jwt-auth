import {
    BadRequestException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from 'src/constants/jwt-secret';
import { PrismaService } from 'src/database/prisma.service';
import { SignInDto } from './dto/sign-in.dto';
import { TokenVerifiedDto } from './dto/token-verified.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) { }

    async signIn(data: SignInDto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: data.email,
                }, include: {
                    Role: true
                }
            });
            if (!user) throw new NotFoundException("User doesn't exist.");

            const isMatch = await bcrypt.compare(data.password, user.password);
            if (!isMatch) throw new UnauthorizedException();

            const payload: TokenVerifiedDto = {
                id: user.id,
                email: user.email,
                roles: user.Role,
            };

            return {
                access_token: await this.jwt.signAsync(payload, { secret: jwtConstants.secret, expiresIn: '1h'}),
            };
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async verifyToken(bearerToken: string): Promise<TokenVerifiedDto> {
        try {
            const token = bearerToken.replace('Bearer ', '');
            const verifiedToken = await this.jwt.verify(token);

            const payload: TokenVerifiedDto = {
                id: verifiedToken.id,
                email: verifiedToken.email,
                roles: verifiedToken.roles
            }

            return payload;
        } catch (error) {
            throw new UnauthorizedException(error.message);
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