import { execFileSync } from 'node:child_process';

import { defineConfig } from 'vite';

function repositoryName(): string {
  const fromGithub = process.env.GITHUB_REPOSITORY?.split('/')[1];
  if (fromGithub) return fromGithub;

  try {
    const remote = execFileSync('git', ['config', '--get', 'remote.origin.url'], {
      encoding: 'utf8',
    }).trim();
    const match = remote.match(/[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (match?.[2]) return match[2];
  } catch {
    // A source archive can be built without a Git remote.
  }

  return 'fomo-events';
}

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : `/${repositoryName()}/`,
  root: 'site',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
}));
