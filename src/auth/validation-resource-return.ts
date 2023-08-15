import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationResult {
    permission: string[]
    resourceId: number[]

}
