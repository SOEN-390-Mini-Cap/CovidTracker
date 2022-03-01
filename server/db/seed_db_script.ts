import { seedDb } from "./seed_db";

(async () => {
    await seedDb();
    console.log("Finished seeding database...");
})();
