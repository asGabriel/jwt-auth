import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationResult {
    permission: string
    owneronly: boolean
    resourceId: number

    constructor(permission: string,  owneronly: boolean, resourceId: number,) {
        this.permission = permission;
        this.resourceId = resourceId;
        this.owneronly = owneronly;
    }

}
