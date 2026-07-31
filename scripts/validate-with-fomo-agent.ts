import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

function candidatePaths(): string[] {
  return [
    process.env.FOMO_AGENT_PATH,
    resolve(repositoryRoot, '..', 'fomo-agent'),
    process.env.FOMO_AGENT_FALLBACK_PATH,
  ].filter((path): path is string => Boolean(path));
}

function locateAgent(): string | undefined {
  return candidatePaths().find((path) => existsSync(resolve(path, 'package.json')));
}

function runAgentValidation(agentPath: string, args: string[]): void {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(npmCommand, ['run', 'fomo', '--', ...args], {
    cwd: agentPath,
    encoding: 'utf8',
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const agentPath = locateAgent();
if (!agentPath) {
  process.stderr.write(
    'Could not locate fomo-agent. Set FOMO_AGENT_PATH=/path/to/fomo-agent or optionally FOMO_AGENT_FALLBACK_PATH=/path/to/fomo-agent. No dependency was installed automatically.\n',
  );
  process.exit(1);
}

process.stdout.write(`Using fomo-agent at ${agentPath}.\n`);
runAgentValidation(agentPath, [
  'validate-config',
  resolve(repositoryRoot, 'config/preferences.yaml'),
]);
runAgentValidation(agentPath, ['validate-events', resolve(repositoryRoot, 'data/events.json')]);
process.stdout.write(
  'fomo-agent validated preferences and events. Its 0.1.0 CLI has no run-history or source-list command.\n',
);
