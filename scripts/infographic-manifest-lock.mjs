import { randomUUID } from 'node:crypto';
import { open, readFile, rename, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

export class ManifestLockError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = 'ManifestLockError';
    this.safeCode = 'MANIFEST_LOCKED';
    this.abort = true;
  }
}

function processIsAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return null;
  if (pid === process.pid) return true;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error?.code === 'ESRCH') return false;
    return true;
  }
}

async function readOwner(lockPath) {
  try {
    const owner = JSON.parse(await readFile(lockPath, 'utf8'));
    return owner && typeof owner === 'object' ? owner : null;
  } catch {
    return null;
  }
}

export async function acquireManifestLock(manifestPath, {
  pid = process.pid,
  now = () => new Date().toISOString(),
  isProcessAlive = processIsAlive,
  invalidLockGraceMs = 30_000,
} = {}) {
  const lockPath = `${manifestPath}.upload.lock`;
  const token = randomUUID();
  const owner = { pid, acquiredAt: now(), token };

  for (let attempt = 0; attempt < 2; attempt += 1) {
    let handle;
    try {
      handle = await open(lockPath, 'wx');
      await handle.writeFile(`${JSON.stringify(owner)}\n`, 'utf8');
      await handle.close();

      let released = false;
      return async () => {
        if (released) return;
        released = true;
        const current = await readOwner(lockPath);
        if (current?.token !== token) return;
        try {
          await unlink(lockPath);
        } catch (error) {
          if (error?.code !== 'ENOENT') throw error;
        }
      };
    } catch (error) {
      if (handle) {
        await handle.close().catch(() => {});
        await unlink(lockPath).catch(() => {});
      }
      if (error?.code !== 'EEXIST') throw error;

      const existing = await readOwner(lockPath);
      let invalidLockExpired = false;
      if (!existing) {
        try {
          const details = await stat(lockPath);
          invalidLockExpired = Date.parse(owner.acquiredAt) - details.mtimeMs >= invalidLockGraceMs;
        } catch {
          continue;
        }
      }
      if ((existing && isProcessAlive(existing.pid) === false) || invalidLockExpired) {
        const stalePath = path.join(
          path.dirname(lockPath),
          `.${path.basename(lockPath)}.stale.${pid}.${randomUUID()}`,
        );
        try {
          await rename(lockPath, stalePath);
          await unlink(stalePath).catch(() => {});
          continue;
        } catch (renameError) {
          if (renameError?.code === 'ENOENT') continue;
          throw renameError;
        }
      }
      throw new ManifestLockError(
        'Another infographic manifest writer holds the lock; wait for it to finish or inspect the lock owner',
        error,
      );
    }
  }
  throw new ManifestLockError('Could not recover a stale infographic manifest lock');
}
