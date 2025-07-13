import { IsDecimal, IsDefined, IsIP, IsString, IsUUID } from 'class-validator';

export class SingleIdValidator {
  @IsUUID()
  id: string;
}

export class RequiredParamValidator {

  @IsString()
  @IsDefined()
  param: string;

}

export class VerifyForgetPasswordRequestDto {
  @IsString()
  @IsDefined()
  token: string

  @IsIP()
  @IsDefined()
  ipAddress: string
}