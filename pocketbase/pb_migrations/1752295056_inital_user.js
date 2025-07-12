/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const SuperuserEmail = $os.getenv("PB_SUPERUSER_EMAIL") || "";
    const SuperuserPassword = $os.getenv("PB_SUPERUSER_PASSWORD") || "";

    console.log(JSON.stringify($os.getenv("PB_SUPERUSER_EMAIL")));

    let superusers = app.findCollectionByNameOrId("_superusers");
    let record = new Record(superusers);

    // note: the values can be eventually loaded via $os.getenv(key)
    // or from a special local config file
    record.set("email", SuperuserEmail);
    record.set("password", SuperuserPassword);

    app.save(record);
  },
  (app) => {
    // optional revert operation
    try {
      let record = app.findAuthRecordByEmail(
        "_superusers",
        "superuser@gmail.com"
      );
      app.delete(record);
    } catch {
      // silent errors (probably already deleted)
    }
  }
);
