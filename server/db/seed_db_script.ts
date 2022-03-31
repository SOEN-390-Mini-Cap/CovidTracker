import { seedDb } from "./seed_db";

(async () => {
    await seedDb(10);
    console.log("Finished seeding database...");
})();
