import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

import { parseDocument } from 'yaml';

type JsonRecord = Record<string, unknown>;

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const secretKeyPattern = /(?:api[_-]?key|secret|token|password|private[_-]?key|credential)/i;

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

async function readJson(relativePath: string): Promise<JsonRecord> {
  const path = join(repositoryRoot, relativePath);
  let parsed: unknown;
  try {
    parsed = JSON.parse(await readFile(path, 'utf8')) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${relativePath} is not valid JSON: ${message}`);
  }
  if (!isRecord(parsed)) throw new Error(`${relativePath} must contain a JSON object.`);
  return parsed;
}

function assertVersionAndArray(file: string, value: JsonRecord, collection: string): unknown[] {
  if (value.version !== 1 || !Array.isArray(value[collection])) {
    throw new Error(`${file} must be a version 1 container with a ${collection} array.`);
  }
  return value[collection];
}

function assertSafeRenderingTypes(event: unknown, index: number): void {
  if (!isRecord(event)) throw new Error(`data/events.json event ${index} must be an object.`);
  for (const key of ['title', 'date_precision', 'status']) {
    if (typeof event[key] !== 'string') {
      throw new Error(`data/events.json event ${index}.${key} must be a string.`);
    }
  }
  const stringsOrNull = ['description', 'start_at', 'end_at', 'timezone'];
  for (const key of stringsOrNull) {
    const value = event[key];
    if (value !== null && typeof value !== 'string') {
      throw new Error(`data/events.json event ${index}.${key} must be a string or null.`);
    }
  }
  if (
    !Array.isArray(event.categories) ||
    !event.categories.every((value) => typeof value === 'string')
  ) {
    throw new Error(`data/events.json event ${index}.categories must be a string array.`);
  }
  if (
    event.tags !== undefined &&
    (!Array.isArray(event.tags) || !event.tags.every((value) => typeof value === 'string'))
  ) {
    throw new Error(`data/events.json event ${index}.tags must be a string array when provided.`);
  }
  if (!isRecord(event.venue)) {
    throw new Error(`data/events.json event ${index}.venue must be an object.`);
  }
  assertNullableStrings(
    event.venue,
    ['name', 'city', 'region', 'country', 'address'],
    index,
    'venue',
  );
  if (!isRecord(event.language) || !Array.isArray(event.language.codes)) {
    throw new Error(`data/events.json event ${index}.language must have a codes array.`);
  }
  if (!event.language.codes.every((value) => typeof value === 'string')) {
    throw new Error(`data/events.json event ${index}.language.codes must be a string array.`);
  }
  if (!isRecord(event.pricing)) {
    throw new Error(`data/events.json event ${index}.pricing must be an object.`);
  }
  assertNullableNumbers(event.pricing, ['minimum', 'maximum'], index, 'pricing');
  assertNullableStrings(event.pricing, ['currency'], index, 'pricing');
  if (typeof event.pricing.is_free !== 'boolean') {
    throw new Error(`data/events.json event ${index}.pricing.is_free must be a boolean.`);
  }
  if (!isRecord(event.ticketing) || typeof event.ticketing.status !== 'string') {
    throw new Error(`data/events.json event ${index}.ticketing must have a string status.`);
  }
  if (event.ticketing.official_url !== null && typeof event.ticketing.official_url !== 'string') {
    throw new Error(
      `data/events.json event ${index}.ticketing.official_url must be a string or null.`,
    );
  }
  if (!isRecord(event.ranking) || typeof event.ranking.level !== 'string') {
    throw new Error(`data/events.json event ${index}.ranking must have a string level.`);
  }
  if (
    !Array.isArray(event.ranking.reasons) ||
    !event.ranking.reasons.every((value) => typeof value === 'string')
  ) {
    throw new Error(`data/events.json event ${index}.ranking.reasons must be a string array.`);
  }
  if (!isRecord(event.tracking)) {
    throw new Error(`data/events.json event ${index}.tracking must be an object.`);
  }
  assertNullableStrings(
    event.tracking,
    ['first_seen_at', 'last_seen_at', 'last_verified_at'],
    index,
    'tracking',
  );
  if (!Array.isArray(event.sources)) {
    throw new Error(`data/events.json event ${index}.sources must be an array.`);
  }
}

function assertNullableStrings(
  value: JsonRecord,
  keys: string[],
  eventIndex: number,
  parent: string,
): void {
  for (const key of keys) {
    if (value[key] !== null && typeof value[key] !== 'string') {
      throw new Error(
        `data/events.json event ${eventIndex}.${parent}.${key} must be a string or null.`,
      );
    }
  }
}

function assertNullableNumbers(
  value: JsonRecord,
  keys: string[],
  eventIndex: number,
  parent: string,
): void {
  for (const key of keys) {
    if (value[key] !== null && typeof value[key] !== 'number') {
      throw new Error(
        `data/events.json event ${eventIndex}.${parent}.${key} must be a number or null.`,
      );
    }
  }
}

function assertRunRenderingTypes(run: unknown, index: number): void {
  if (!isRecord(run)) throw new Error(`data/run-history.json run ${index} must be an object.`);
  for (const key of ['mode', 'ended_at', 'summary']) {
    if (typeof run[key] !== 'string') {
      throw new Error(`data/run-history.json run ${index}.${key} must be a string.`);
    }
  }
  for (const key of ['new_events', 'updated_events', 'sold_out_events', 'cancelled_events']) {
    if (typeof run[key] !== 'number') {
      throw new Error(`data/run-history.json run ${index}.${key} must be a number.`);
    }
  }
  for (const key of ['warnings', 'changed_files']) {
    if (!Array.isArray(run[key]) || !run[key].every((value) => typeof value === 'string')) {
      throw new Error(`data/run-history.json run ${index}.${key} must be a string array.`);
    }
  }
}

function assertNoSecretKeys(value: unknown, path = ''): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoSecretKeys(item, `${path}[${index}]`));
    return;
  }
  if (!isRecord(value)) return;
  for (const [key, nested] of Object.entries(value)) {
    const keyPath = path ? `${path}.${key}` : key;
    if (secretKeyPattern.test(key))
      throw new Error(`Potential secret key found in canonical data: ${keyPath}`);
    assertNoSecretKeys(nested, keyPath);
  }
}

async function readYaml(relativePath: string): Promise<unknown> {
  const document = parseDocument(await readFile(join(repositoryRoot, relativePath), 'utf8'));
  if (document.errors.length > 0) {
    throw new Error(
      `${relativePath} is not valid YAML: ${document.errors[0]?.message ?? 'unknown error'}`,
    );
  }
  return document.toJS();
}

function assertSourceConfiguration(value: unknown): void {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.sources)) {
    throw new Error('config/sources.yaml must be a version 1 document with a sources array.');
  }
  value.sources.forEach((source, index) => {
    if (!isRecord(source))
      throw new Error(`config/sources.yaml source ${index} must be an object.`);
    for (const key of ['name', 'url', 'type', 'trust']) {
      if (typeof source[key] !== 'string') {
        throw new Error(`config/sources.yaml source ${index}.${key} must be a string.`);
      }
    }
    if (
      typeof source.enabled !== 'boolean' ||
      !Array.isArray(source.geographic_scope) ||
      !Array.isArray(source.category_scope)
    ) {
      throw new Error(
        `config/sources.yaml source ${index} has unsafe rendering configuration types.`,
      );
    }
  });
}

function assertPreferencesShape(value: unknown): void {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.profile)) {
    throw new Error('config/preferences.yaml must be a version 1 document with a profile object.');
  }
}

async function main(): Promise<void> {
  const [preferences, sources] = await Promise.all([
    readYaml('config/preferences.yaml'),
    readYaml('config/sources.yaml'),
  ]);
  assertPreferencesShape(preferences);
  assertSourceConfiguration(sources);
  const [events, runs, rejected, attended] = await Promise.all([
    readJson('data/events.json'),
    readJson('data/run-history.json'),
    readJson('data/rejected-events.json'),
    readJson('data/attended-events.json'),
  ]);

  const eventList = assertVersionAndArray('data/events.json', events, 'events');
  const runList = assertVersionAndArray('data/run-history.json', runs, 'runs');
  assertVersionAndArray('data/rejected-events.json', rejected, 'events');
  assertVersionAndArray('data/attended-events.json', attended, 'events');
  eventList.forEach(assertSafeRenderingTypes);
  runList.forEach(assertRunRenderingTypes);
  [events, runs, rejected, attended].forEach((value) => assertNoSecretKeys(value));

  process.stdout.write(
    'Local data is safe for rendering. Authoritative event and preference schema validation belongs to fomo-agent.\n',
  );
}

await main();
