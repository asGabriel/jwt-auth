import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { NewUserSetupDto } from './dto/new-user-setup.dto';
import { SetupService } from './setup.service';
import { UserCreatedDto } from './dto/user-created.dto';

@Controller('setup')
export class SetupController {
    constructor(
        private readonly setupService: SetupService
    ) { }

    @Post("superuser")
    async createSuperUser(@Headers("Authorization") authHeader: string, @Body() data: NewUserSetupDto): Promise<UserCreatedDto> {
        return await this.setupService.createSuperUser(data, authHeader);
    }

    @Get("roles")
    async setupRoles(): Promise<void> {
        return await this.setupService.rbacSetup();
    }

}
