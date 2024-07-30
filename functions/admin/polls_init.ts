export async function onRequest(context) {
  const { POLLS_DB } = context.env;

  const createPollsTable = `
    CREATE TABLE IF NOT EXISTS polls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_name TEXT NOT NULL,
      poll_description TEXT,
      poll_type TEXT CHECK(poll_type IN ('single select', 'multi select')) NOT NULL,
      created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ended_date TIMESTAMP
    );
  `;

  const createOptionsTable = `
    CREATE TABLE IF NOT EXISTS options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id INTEGER NOT NULL,
      option_text TEXT NOT NULL,
      option_image TEXT,
      FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
    );
  `;

  const createResponsesTable = `
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      poll_id INTEGER NOT NULL,
      option_ids TEXT NOT NULL,
      UNIQUE(user_id, poll_id),
      FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
    );
  `;

  try {
    await POLLS_DB.prepare(createPollsTable).run();
    await POLLS_DB.prepare(createOptionsTable).run();
    await POLLS_DB.prepare(createResponsesTable).run();

    return new Response('Tables created successfully', { status: 200 });
  } catch (error) {
    return new Response(`Error creating tables: ${error.message}`, { status: 500 });
  }
}
