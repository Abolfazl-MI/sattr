import { IsDefined, IsString, IsUUID } from 'class-validator';

export class SingleIdValidator {
  @IsUUID()
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}

export class RequiredParamValidator {
  @IsString()
  @IsDefined()
  param: string;
}
