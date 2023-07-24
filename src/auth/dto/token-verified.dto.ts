import { RolesTokenDto } from "./roles.dto";

export class TokenVerifiedDto {
    id: string;

    email: string;

    roles: RolesTokenDto[];
}
