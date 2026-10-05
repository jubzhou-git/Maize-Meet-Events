const mockSqlite = {
  openDatabaseAsync: jest.fn(),
};

jest.mock('expo-sqlite', () => mockSqlite);

const { seedEvents } = require('../data/seedEvents');

function createDatabase({ events = [], savedEvents = [], notes = [], registrations = [] } = {}) {
  const state = {
    events: events.map((event) => ({ ...event })),
    notes: notes.map((note) => ({ ...note })),
    registrations: registrations.map((registration) => ({ ...registration })),
    savedEvents: savedEvents.map((savedEvent) => ({ ...savedEvent })),
    userVersion: 0,
  };

  return {
    state,
    async execAsync(sql) {
      if (sql.includes('DROP TABLE IF EXISTS')) {
        state.events = [];
        state.notes = [];
        state.registrations = [];
        state.savedEvents = [];
      }

      if (sql.includes('DELETE FROM events') && sql.includes('GROUP BY id')) {
        const firstRowById = new Set();
        state.events = state.events.filter((event) => {
          if (firstRowById.has(event.id)) {
            return false;
          }
          firstRowById.add(event.id);
          return true;
        });
      }

      const versionMatch = sql.match(/PRAGMA user_version = (\d+)/);
      if (versionMatch) {
        state.userVersion = Number(versionMatch[1]);
      }
    },
    async getAllAsync(sql) {
      if (sql.includes('PRAGMA table_info(events)')) {
        return state.events.length ? [{ name: 'startsAt' }] : [];
      }
      if (sql.includes('SELECT * FROM events')) {
        return state.events.map((event) => ({ ...event }));
      }
      return [];
    },
    async getFirstAsync(sql) {
      if (sql.includes('PRAGMA user_version')) {
        return { user_version: state.userVersion };
      }
      return null;
    },
    async runAsync(sql, ...params) {
      if (sql.includes('INSERT') && sql.includes('events')) {
        const [id, title, description, startsAt, endsAt, category, location, room, capacity, registeredCount, tags] = params;
        if (sql.includes('OR IGNORE') && state.events.some((event) => event.id === id)) {
          return { changes: 0 };
        }
        state.events.push({
          rowId: state.events.length + 1,
          id,
          title,
          description,
          startsAt,
          endsAt,
          category,
          location,
          room,
          capacity,
          registeredCount,
          tags,
        });
        return { changes: 1 };
      }
      return { changes: 0 };
    },
  };
}

function loadDatabaseModule(database) {
  jest.resetModules();
  mockSqlite.openDatabaseAsync.mockReset();
  mockSqlite.openDatabaseAsync.mockResolvedValue(database);
  return require('./database');
}

test('removes legacy duplicate events while retaining user records', async () => {
  const firstSeed = seedEvents[0];
  const secondSeed = seedEvents[1];
  const database = createDatabase({
    events: [
      { ...firstSeed, rowId: 1, tags: JSON.stringify(firstSeed.tags) },
      { ...firstSeed, rowId: 2, tags: JSON.stringify(firstSeed.tags) },
      { ...secondSeed, rowId: 3, tags: JSON.stringify(secondSeed.tags) },
    ],
    savedEvents: [{ rowId: 1, eventId: firstSeed.id }],
    notes: [{ eventId: firstSeed.id, body: 'Bring a notebook', updatedAt: '2026-01-01T00:00:00.000Z' }],
    registrations: [{ rowId: 1, eventId: secondSeed.id, createdAt: '2026-01-01T00:00:00.000Z' }],
  });
  const { initializeDatabase } = loadDatabaseModule(database);

  await initializeDatabase();

  expect(database.state.events.filter((event) => event.id === firstSeed.id)).toHaveLength(1);
  expect(database.state.savedEvents).toEqual([{ rowId: 1, eventId: firstSeed.id }]);
  expect(database.state.notes).toEqual([
    { eventId: firstSeed.id, body: 'Bring a notebook', updatedAt: '2026-01-01T00:00:00.000Z' },
  ]);
  expect(database.state.registrations).toEqual([
    { rowId: 1, eventId: secondSeed.id, createdAt: '2026-01-01T00:00:00.000Z' },
  ]);
});

test('does not add another copy of a seed event on repeated initialization', async () => {
  const database = createDatabase();
  const { getEvents, initializeDatabase } = loadDatabaseModule(database);

  await initializeDatabase();
  await initializeDatabase();

  expect(await getEvents()).toHaveLength(seedEvents.length);
  expect(new Set(database.state.events.map((event) => event.id)).size).toBe(seedEvents.length);
});
