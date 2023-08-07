import { Body, Controller, Get, Post } from '@nestjs/common';
import { isPublic } from 'src/decorator/ispublic.decorator';
import { NewUserSetupDto } from './dto/new-user-setup.dto';
import { UserCreatedDto } from './dto/user-created.dto';
import { SetupService } from './setup.service';

@Controller('setup')
export class SetupController {
    constructor(
        private readonly setupService: SetupService
    ) { }

    @Post("superuser")
    @isPublic()
    async createSuperUser(@Body() data: NewUserSetupDto): Promise<UserCreatedDto> {
        return await this.setupService.createSuperUser(data);
    }

    @Get("roles")
    async setupRoles(): Promise<String> {
        return await this.setupService.rbacSetup();
    }

}
