import type { DatabaseSync } from "node:sqlite";
export function assertDatabaseIdentity(
	database: DatabaseSync,
	businessId: string,
	allowLegacy = false,
) {
	database.exec(
		"CREATE TABLE IF NOT EXISTS business_identity(id INTEGER PRIMARY KEY CHECK(id=1),business_id TEXT NOT NULL)",
	);
	const row = database
		.prepare("SELECT business_id FROM business_identity WHERE id=1")
		.get() as { business_id: string } | undefined;
	if (row && row.business_id !== businessId)
		throw new Error(
			"This database belongs to a different business. Configure a separate OWNER_DATA_DIR.",
		);
	if (!row) {
		const table = database
			.prepare(
				"SELECT name FROM sqlite_master WHERE type='table' AND name='inquiries'",
			)
			.get();
		const populated =
			table &&
			(
				database
					.prepare("SELECT COUNT(*) AS count FROM inquiries")
					.get() as { count: number }
			).count > 0;
		if (populated && !allowLegacy)
			throw new Error(
				"Existing inquiry data needs explicit legacy adoption for this business.",
			);
		database
			.prepare(
				"INSERT OR IGNORE INTO business_identity(id,business_id) VALUES(1,?)",
			)
			.run(businessId);
		const actual = database
			.prepare("SELECT business_id FROM business_identity WHERE id=1")
			.get() as { business_id: string };
		if (actual.business_id !== businessId)
			throw new Error(
				"Database identity changed; use a separate directory.",
			);
	}
}
