import { Env } from "@shared/types";

export const onRequest: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;

    const createPollsTable = `
    CREATE TABLE IF NOT EXISTS polls (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      selections TEXT CHECK(selections IN ('single', 'multiple')) NOT NULL,
      created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ended TIMESTAMP
    );
  `;

    const createOptionsTable = `
    CREATE TABLE IF NOT EXISTS options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id TEXT NOT NULL,
      text TEXT NOT NULL,
      image TEXT,
      FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
    );
  `;

    const createResponsesTable = `
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user TEXT NOT NULL,
      poll_id TEXT NOT NULL,
      UNIQUE(user, poll_id),
      FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
    );
  `;

    const createResponseOptionsTable = `
    CREATE TABLE IF NOT EXISTS response_options (
      response_id INTEGER NOT NULL,
      option_id INTEGER NOT NULL,
      PRIMARY KEY (response_id, option_id),
      FOREIGN KEY (response_id) REFERENCES responses(id) ON DELETE CASCADE,
      FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE CASCADE
    );
  `;

    await POLLS_DB.prepare(createPollsTable).run();
    await POLLS_DB.prepare(createOptionsTable).run();
    await POLLS_DB.prepare(createResponsesTable).run();
    await POLLS_DB.prepare(createResponseOptionsTable).run();

    return new Response();
};
