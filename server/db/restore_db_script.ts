import {restoreDb} from "./restore_db";

(async () => {
    await restoreDb();
    console.log("Finished restoring database...");
})();
