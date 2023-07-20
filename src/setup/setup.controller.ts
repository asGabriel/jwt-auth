import { Controller, Get, Post } from '@nestjs/common';
import { SetupService } from './setup.service';

@Controller('setup')
export class SetupController {
    constructor(
        private readonly setupService: SetupService
    ) {}

    @Post("superuser")
    async createSuperUser() {
        
    }

    @Get("roles")
    async setupRoles() {
        return await this.setupService.rbacSetup();
    }

}
