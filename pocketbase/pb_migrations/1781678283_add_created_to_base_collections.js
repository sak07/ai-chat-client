/// <reference path="../pb_data/types.d.ts" />
// PocketBase v0.23+ base collections have no system created/updated fields.
// Add an autodate "created" field so records can be sorted chronologically.
migrate((app) => {
  for (const name of ['conversations', 'messages']) {
    const collection = app.findCollectionByNameOrId(name)
    if (collection.fields.fieldNames().includes('created')) continue

    collection.fields.add(new AutodateField({
      name: 'created',
      onCreate: true,
      onUpdate: false,
      system: false,
      hidden: false,
    }))
    app.save(collection)
  }
}, (app) => {
  for (const name of ['conversations', 'messages']) {
    const collection = app.findCollectionByNameOrId(name)
    collection.fields.removeByName('created')
    app.save(collection)
  }
})
