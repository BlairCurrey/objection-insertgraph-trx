import { Model, RelationMappings } from "objection";
import Post from "./post";

class User extends Model {
  static tableName = "users";

  id!: number;
  name!: string;
  posts?: Post[];

  static relationMappings: RelationMappings = {
    posts: {
      relation: Model.HasManyRelation,
      modelClass: Post,
      join: {
        from: "users.id",
        to: "posts.user_id",
      },
    },
  };
}

export default User;
