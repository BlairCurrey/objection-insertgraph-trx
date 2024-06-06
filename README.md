# Purpose

Demonstrate the behavior of `Objection.js`'s `insertGraphAndFetch` method on partial failure.

For context, `insertGraphAndFetch` (and similar) intentionally do not use transactions internally. So part of the insert can succeed and part can fail. https://github.com/Vincit/objection.js/issues/1939

# So what happens when only part of the graph insert fails?

Inserting a primary resource succesfully and a bad related resource will throw an error, and the primary resource and any other good related resources will be inserted:

```tsx
const newUser = await User.query().insertGraphAndFetch({
  name: "Alice",
  posts: [
    {
      title: "Title1",
      body: "This is the body of the first post",
    },
    // This title is not unique and will fail the db's unique constraint
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
```

Failing to insert a bad primary resource with OK related resources will throw an error, and none of the resources will be inserted (probably obvious, but included for thoroughness).

```tsx
const newUser = await User.query().insertGraphAndFetch({
  // Name will fail db check that disallows empty strings
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
```

# Development

## Run locally

Clone the repo then run:

    pnpm i
    pnpm up
    pnpm build && pnpm start

## Debugging sqlite state

Connect to the sqlite db via the cli:

    sqlite3 dev.sqlite3

Confirm the connection and that migrations ran with:

    .schema
