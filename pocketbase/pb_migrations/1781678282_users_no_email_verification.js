/// <reference path="../pb_data/types.d.ts" />
// In PocketBase v0.23+, email verification is enforced via authRule = "verified = true".
// Setting authRule to "" (any authenticated user) allows signup → auto-login without email confirmation.
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users")
  collection.authRule = ""
  return app.save(collection)
}, (_app) => {
  // rollback: no-op — leave authRule as-is
})
