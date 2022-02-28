import { seedDb } from "./seed_db";

(async () => {
    await seedDb(100);
    console.log("Finished seeding database...");
})();
