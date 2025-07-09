import { IsUUID } from 'class-validator';

export class SingleIdValidator {
  @IsUUID()
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}
