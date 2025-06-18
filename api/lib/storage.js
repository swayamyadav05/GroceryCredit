const pkg = require("pg");
const { Pool } = pkg;
const { drizzle } = require("drizzle-orm/node-postgres");
const { credits, insertCreditSchema } = require("../../shared/schema.js");
const { eq, sql } = require("drizzle-orm");
require("dotenv/config");

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function getCredits() {
    return db.select().from(credits);
}

async function getCreditsByMonth(year, month) {
    const monthStr = month.toString().padStart(2, "0");
    const likePattern = `${year}-${monthStr}-%`;
    return db
        .select()
        .from(credits)
        .where(sql`date LIKE ${likePattern}`);
}

async function createCredit(data) {
    const validated = insertCreditSchema.parse(data);
    const [created] = await db.insert(credits).values(validated).returning();
    return created;
}

async function updateCredit(id, update) {
    const [updated] = await db
        .update(credits)
        .set(update)
        .where(eq(credits.id, id))
        .returning();
    return updated ?? null;
}

async function deleteCredit(id) {
    const result = await db
        .delete(credits)
        .where(eq(credits.id, id))
        .returning();
    return result.length > 0;
}

module.exports = {
    getCredits,
    getCreditsByMonth,
    createCredit,
    updateCredit,
    deleteCredit,
};
