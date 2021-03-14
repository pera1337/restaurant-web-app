import { Field, ObjectType } from "type-graphql";
import { Connection } from "typeorm";

export type MyContext = {
  connection: Connection;
};

@ObjectType()
export class FieldError {
  @Field(() => String, { nullable: true })
  field?: string;

  @Field()
  message: string;
}
