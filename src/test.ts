/* eslint-disable no-await-in-loop */
import fs, { Dirent } from 'fs';
import path from 'path';
import { promisify } from 'util';
import PromisePool from 'es6-promise-pool';

const readDir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const promises: Promise<void> = [];

function getPromise() {

}

const pool = new PromisePool();

interface KondoDirectory {
  path: string;
  size: number;
  children: KondoDirectory[];
  childrenFileSizes: {
    other: number;
  }
}

function group<T>(list: T[], groupSize: number) {
  return list.reduce((groups: T[][], current) => {
    const lastGroup = groups[groups.length - 1];

    if (lastGroup.length < groupSize) {
      lastGroup.push(current);
    } else {
      groups.push([current]);
    }

    return groups;
  }, [[]]);
}

async function processDirectory(dirPath: string, entries: Dirent[], depth: number): Promise<KondoDirectory> {
  const dir: KondoDirectory = {
    path: dirPath,
    size: 0,
    children: [],
    childrenFileSizes: {
      other: 0,
    },
  };

  // if (depth >= 10) return dir;

  const childDirs = entries.filter(entry => entry.isDirectory());
  const childFiles = entries.filter(entry => entry.isFile());

  const dirTasks: (() => Promise<KondoDirectory | null>)[] = childDirs.map(childDir => async () => {
    try {
      const entryPath = path.resolve(dirPath, childDir.name);
      const childEntries = await readDir(entryPath, { withFileTypes: true });
      return processDirectory(entryPath, childEntries, depth + 1);
    } catch (err) {
      return null;
    }
  });

  // eslint-disable-next-line no-restricted-syntax
  for (const childFile of childFiles) {
    const entryPath = path.resolve(dirPath, childFile.name);

    let stats;
    try {
      stats = await stat(entryPath);
    } catch (err) {
      // eslint-disable-next-line no-continue
      continue;
    }

    dir.childrenFileSizes.other += stats.size;
    dir.size += stats.size;
  }

  const groupedTasks = group(dirTasks, 3);

  // eslint-disable-next-line no-restricted-syntax
  for (const taskGroup of groupedTasks) {
    await Promise.all(taskGroup.map(async task => {
      const childKondoDir = await task();

      if (childKondoDir) {
        dir.children.push(childKondoDir);
        dir.size += childKondoDir.size;
      }
    }));
  }

  return dir;
}

export default async function test() {
  const dir = await readDir('/', {
    withFileTypes: true,
  });

  const rootDir = await processDirectory('/', dir, 0);

  console.log(rootDir);
}
