import { Model } from "objection";

class Post extends Model {
  static tableName = "posts";

  id!: number;
  user_id!: number;
  title!: string;
  body!: string;
}

export default Post;
