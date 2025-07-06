import { IsUUID } from 'class-validator';

export class SingleIdValidator {
  @IsUUID()
  id: string;
}
