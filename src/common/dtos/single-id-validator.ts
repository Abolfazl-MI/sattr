import { IsDefined, IsString, IsUUID } from 'class-validator';

export class SingleIdValidator {
  @IsUUID()
  id: string;
}

export class RequiredParamValidator {
  @IsString()
  @IsDefined()
  param: string;
}
