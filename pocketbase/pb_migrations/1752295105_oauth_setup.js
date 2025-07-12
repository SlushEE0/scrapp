/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const ClientID = $os.getenv("GOOGLE_CLIENT_ID") || "";
    const ClientSecret = $os.getenv("GOOGLE_CLIENT_SECRET") || "";

    const providers = [
      {
        pkce: null,
        name: "google", // or whatever provider you want
        clientId: ClientID,
        clientSecret: ClientSecret,
        authUrl: "",
        tokenUrl: "",
        userApiUrl: "",
        displayName: ""
      }
    ];

    const users = app.findCollectionByNameOrId("users");
    users.oauth2.providers = providers;
    users.oauth2.enabled = true;
    app.save(users);
  },
  (app) => {
    // add down queries...
  }
);
