import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => {return SetMetadata("roles", roles)};
