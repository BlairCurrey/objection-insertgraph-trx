import User from "./models/user";
import db from "./db";
import Post from "./models/post";

async function PartialInsertFailureOnRelatedResources() {
  try {
    // Insert a new user and three posts, one of which will cause an error
    console.log("Inserting a user with 3 posts (1 bad)");
    const newUser = await User.query().insertGraphAndFetch({
      name: "Alice",
      posts: [
        {
          title: "Title1",
          body: "This is the body of the first post",
        },
        // This title is not unique and will therefore cause an error
        {
          title: "Title1",
          body: "This is the body of the second post",
        },
        {
          title: "Title3",
          body: "This is the body of the third post",
        },
      ],
    }); // this errors
    console.log("Inserted and fetched user:", newUser);
  } catch (error) {
    // UniqueViolationError
    console.error("Error inserting and fetching user:", error);
  }
}

async function PartialInsertFailureOnPrimaryResource() {
  try {
    // Insert a new user and three posts, with the user failing
    console.log("Inserting a bad user with 3 posts");
    const newUser = await User.query().insertGraphAndFetch({
      // Name will fail DB check that disallows empty strings
      name: "",
      // Posts are OK
      posts: [
        {
          title: "Title1",
          body: "This is the body of the first post",
        },
        {
          title: "Title2",
          body: "This is the body of the second post",
        },
        {
          title: "Title3",
          body: "This is the body of the third post",
        },
      ],
    }); // this errors
    console.log("Inserted and fetched user:", newUser);
  } catch (error) {
    // CheckViolationError
    console.error("Error inserting and fetching user:", error);
  }
}

async function main() {
  // Run all the scenarios, whiping db in between and printing the number of users and posts
  try {
    for (const fn of [
      PartialInsertFailureOnRelatedResources,
      PartialInsertFailureOnPrimaryResource,
    ]) {
      await User.query().truncate();
      await Post.query().truncate();
      await fn();
      const [userCount, postCount] = await Promise.all([
        User.query().resultSize(),
        Post.query().resultSize(),
      ]);
      console.log(
        `Number of users: ${userCount}, Number of posts: ${postCount}`
      );
    }
  } catch (error) {
    console.error("Error executing functions:", error);
  } finally {
    await db.destroy();
  }
}

main();
