import { seedDb } from "./seed_db";

(async () => {
    await seedDb(1);
    console.log("Finished seeding database...");
})();
