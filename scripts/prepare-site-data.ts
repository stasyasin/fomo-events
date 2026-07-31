import { execFileSync } from 'node:child_process';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

type JsonRecord = Record<string, unknown>;

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const generatedDirectory = join(repositoryRoot, 'site', 'public', 'generated');

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

async function readJson(path: string): Promise<JsonRecord> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await readFile(path, 'utf8')) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not parse JSON at ${path}: ${message}`);
  }

  if (!isRecord(parsed)) throw new Error(`Expected a JSON object at ${path}.`);
  return parsed;
}

function assertEventDatabase(
  value: JsonRecord,
): asserts value is JsonRecord & { events: unknown[] } {
  if (value.version !== 1 || !Array.isArray(value.events)) {
    throw new Error(
      'data/events.json must be a FOMO Agent v1 event database with an events array.',
    );
  }
}

function assertRunHistory(value: JsonRecord): asserts value is JsonRecord & { runs: unknown[] } {
  if (value.version !== 1 || !Array.isArray(value.runs)) {
    throw new Error(
      'data/run-history.json must be a FOMO Agent v1 run-history container with a runs array.',
    );
  }
}

function stringValues(values: unknown[]): string[] {
  return values.filter((value): value is string => typeof value === 'string');
}

function safeRepository(): { name: string; url: string } {
  const githubRepository = process.env.GITHUB_REPOSITORY;
  const githubMatch = githubRepository?.match(/^([^/]+)\/([^/]+)$/);
  if (githubMatch?.[1] && githubMatch[2]) {
    return { name: githubMatch[2], url: `https://github.com/${githubMatch[1]}/${githubMatch[2]}` };
  }
  const remote = githubRepository ?? readGitRemote();
  const match = remote?.match(/(?:github\.com[:/])([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (match?.[1] && match[2]) {
    return { name: match[2], url: `https://github.com/${match[1]}/${match[2]}` };
  }
  return { name: 'fomo-events', url: 'https://github.com/stasyasin/fomo-events' };
}

function readGitRemote(): string | undefined {
  try {
    return execFileSync('git', ['config', '--get', 'remote.origin.url'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
    }).trim();
  } catch {
    return undefined;
  }
}

async function markdownReportLinks(repositoryUrl: string): Promise<Record<string, string>> {
  const relativeDirectories = ['reports/daily', 'reports/weekly'];
  const links: Record<string, string> = {};

  for (const relativeDirectory of relativeDirectories) {
    const absoluteDirectory = join(repositoryRoot, relativeDirectory);
    const entries = await readdir(absoluteDirectory, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
      const relativePath = `${relativeDirectory}/${entry.name}`;
      links[relativePath] = `${repositoryUrl}/blob/main/${relativePath}`;
    }
  }

  return links;
}

function reproducibleBuildTimestamp(): string | null {
  const epoch = process.env.SOURCE_DATE_EPOCH;
  if (!epoch || !/^\d+$/.test(epoch)) return null;
  const date = new Date(Number(epoch) * 1_000);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function main(): Promise<void> {
  const [events, runHistory, rejected, attended] = await Promise.all([
    readJson(join(repositoryRoot, 'data', 'events.json')),
    readJson(join(repositoryRoot, 'data', 'run-history.json')),
    readJson(join(repositoryRoot, 'data', 'rejected-events.json')),
    readJson(join(repositoryRoot, 'data', 'attended-events.json')),
  ]);
  assertEventDatabase(events);
  assertRunHistory(runHistory);
  assertEventDatabase(rejected);
  assertEventDatabase(attended);

  const categorySet = new Set<string>();
  const citySet = new Set<string>();
  for (const event of events.events) {
    if (!isRecord(event)) continue;
    if (Array.isArray(event.categories)) {
      for (const category of stringValues(event.categories)) categorySet.add(category);
    }
    if (isRecord(event.venue) && typeof event.venue.city === 'string')
      citySet.add(event.venue.city);
  }

  const repository = safeRepository();
  const reportLinks = await markdownReportLinks(repository.url);
  const output = {
    version: 1,
    events,
    run_history: runHistory,
    metadata: {
      build_timestamp: reproducibleBuildTimestamp(),
      data_updated_at: typeof events.generated_at === 'string' ? events.generated_at : null,
      repository_name: repository.name,
      repository_url: repository.url,
      report_links: reportLinks,
      available_categories: [...categorySet].sort((a, b) => a.localeCompare(b)),
      available_cities: [...citySet].sort((a, b) => a.localeCompare(b)),
    },
  };

  await mkdir(generatedDirectory, { recursive: true });
  await writeFile(
    join(generatedDirectory, 'site-data.json'),
    `${JSON.stringify(output, null, 2)}\n`,
  );
  process.stdout.write('Prepared site/public/generated/site-data.json from canonical data.\n');
}

await main();
