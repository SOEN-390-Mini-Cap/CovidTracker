import { seedDb } from "./seed_db";

(async () => {
    await seedDb(5);
    console.log("Finished seeding database...");
})();
