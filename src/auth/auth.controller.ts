import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post("login")
    async signIn(@Body() data: SignInDto) {
        return await this.authService.signIn(data);
    }

    @Post("logout")
    @UseGuards(AuthGuard)
    async signOut(@Headers('Authorization') authHeader: string) {
        const token = authHeader.replace('Bearer ', '')
        return await this.authService.signOut(token);
    }

}
