import { Controller, Get, Post, Headers, Body } from '@nestjs/common';
import { SetupService } from './setup.service';
import { NewUserSetupDto } from './dto/new-user-setup.dto';
import { User } from '@prisma/client';

@Controller('setup')
export class SetupController {
    constructor(
        private readonly setupService: SetupService
    ) {}

    @Post("superuser")
    async createSuperUser(@Headers("Authorization") authHeader: string, @Body() data: NewUserSetupDto): Promise<User> {
        return await this.setupService.createSuperUser(data, authHeader);
    }

    @Get("roles")
    async setupRoles() {
        return await this.setupService.rbacSetup();
    }

}
