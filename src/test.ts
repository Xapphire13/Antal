/* eslint-disable no-await-in-loop */
import fs, { Dirent } from 'fs';
import path from 'path';
import { promisify } from 'util';

const readDir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const promiseQueue: (() => Promise<void>)[] = [];
const concurrency = 20;
let runningPromises = 0;

function runNextTask() {
  if (runningPromises < concurrency) {
    const nextTask = promiseQueue.shift();

    if (nextTask) {
      nextTask();
    }
  }
}

function scheduleTask(task: () => Promise<void>): Promise<void> {
  return new Promise((res, rej) => {
    const wrapper = () => {
      runningPromises += 1;
      return task().then(res, rej).finally(() => { runningPromises -= 1; runNextTask(); });
    };
    promiseQueue.push(wrapper);

    runNextTask();
  });
}

function awaitOnPool<T>(originalPromise: Promise<T>): Promise<T> {
  runningPromises -= 1;
  return originalPromise.finally(() => { runningPromises += 1; });
}


interface KondoDirectory {
  path: string;
  size: number;
  children: KondoDirectory[];
  childrenFileSizes: {
    other: number;
  }
}

async function processDirectory(dirPath: string, entries: Dirent[]): Promise<KondoDirectory> {
  const dir: KondoDirectory = {
    path: dirPath,
    size: 0,
    children: [],
    childrenFileSizes: {
      other: 0,
    },
  };

  const childDirs = entries.filter(entry => entry.isDirectory());
  const childFiles = entries.filter(entry => entry.isFile());

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

  const dirTasks: (() => Promise<void>)[] = childDirs.map(childDir => async () => {
    try {
      const entryPath = path.resolve(dirPath, childDir.name);
      const childEntries = await readDir(entryPath, { withFileTypes: true });
      const childKondoDir = await processDirectory(entryPath, childEntries);

      if (childKondoDir) {
        dir.children.push(childKondoDir);
        dir.size += childKondoDir.size;
      }
    } catch (err) {
      // ...
    }
  });

  await awaitOnPool(Promise.all(dirTasks.map(task => scheduleTask(task))));

  return dir;
}

export default async function test() {
  const dir = await readDir('/', {
    withFileTypes: true,
  });

  return processDirectory('/', dir);
}
