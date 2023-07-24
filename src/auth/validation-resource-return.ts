import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationResult {
    permission: string
    resource: string
    owneronly: boolean

    constructor(permission: string, resource: string, owneronly: boolean) {
        this.permission = permission;
        this.resource = resource;
        this.owneronly = owneronly;
    }

}
