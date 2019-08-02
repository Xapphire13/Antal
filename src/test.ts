/* eslint-disable no-await-in-loop */
import fs, { Dirent } from 'fs';
import path from 'path';
import { promisify } from 'util';

const readDir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const promiseQueue: (() => Promise<void>)[] = [];
const concurrency = 20;
const limitDepth = true;
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
      return task()
        .then(res, rej)
        .finally(() => {
          runningPromises -= 1;
          runNextTask();
        });
    };
    promiseQueue.push(wrapper);

    runNextTask();
  });
}

function awaitOnPool<T>(originalPromise: Promise<T>): Promise<T> {
  runningPromises -= 1;
  return originalPromise.finally(() => {
    runningPromises += 1;
  });
}

export enum KondoType {
  Document,
  Image,
  Video,
  Audio,
  SourceCode,
  Other
}

export interface KondoDirectory {
  path: string;
  size: number;
  type: KondoType;
  children: KondoDirectory[];
  childrenFileSizes: { [key in KondoType]: number };
}

function getFileType(filename: string): KondoType {
  const ext = path.extname(filename);

  switch (ext) {
    case '.txt':
    case '.pdf':
    case '.md':
      return KondoType.Document;
    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.gif':
      return KondoType.Image;
    case '.mp4':
    case '.mov':
    case '.avi':
    case '.mpg':
    case '.mpeg':
      return KondoType.Video;
    case '.mp3':
    case '.m4a':
    case '.ogg':
      return KondoType.Audio;
    case '.js':
    case '.jsx':
    case '.ts':
    case '.tsx':
    case '.java':
    case '.c':
    case '.cpp':
    case '.cs':
    case '.css':
    case '.html':
    case '.yml':
    case '.json':
      return KondoType.SourceCode;
    default:
      return KondoType.Other;
  }
}

async function processDirectory(
  dirPath: string,
  entries: Dirent[],
  depth: number
): Promise<KondoDirectory> {
  const dir: KondoDirectory = {
    path: dirPath,
    size: 0,
    type: KondoType.Other,
    children: [],
    childrenFileSizes: {
      [KondoType.Audio]: 0,
      [KondoType.Document]: 0,
      [KondoType.Image]: 0,
      [KondoType.Other]: 0,
      [KondoType.SourceCode]: 0,
      [KondoType.Video]: 0
    }
  };

  if (limitDepth && depth >= 6) return dir;

  const childDirs = entries.filter(entry => entry.isDirectory());
  const childFiles = entries.filter(entry => entry.isFile());

  for (const childFile of childFiles) {
    const entryPath = path.resolve(dirPath, childFile.name);

    let stats;
    try {
      stats = await stat(entryPath);
    } catch (err) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const fileType = getFileType(childFile.name);

    dir.childrenFileSizes[fileType] += stats.size;
    dir.size += stats.size;
  }

  const dirTasks: (() => Promise<void>)[] = childDirs.map(
    childDir => async () => {
      try {
        const entryPath = path.resolve(dirPath, childDir.name);
        const childEntries = await readDir(entryPath, { withFileTypes: true });
        const childKondoDir = await processDirectory(
          entryPath,
          childEntries,
          depth + 1
        );

        if (childKondoDir) {
          dir.children.push(childKondoDir);
          dir.size += childKondoDir.size;
        }
      } catch (err) {
        // ...
      }
    }
  );

  await awaitOnPool(Promise.all(dirTasks.map(task => scheduleTask(task))));

  const fileTypesBySize = { ...dir.childrenFileSizes };
  dir.children.forEach(childDir => {
    fileTypesBySize[childDir.type] += childDir.size;
  });

  let predominantType: KondoType = 0;
  let largestSize = fileTypesBySize[predominantType];
  Object.keys(fileTypesBySize).forEach((key: unknown) => {
    const type = key as KondoType;
    if (fileTypesBySize[type] > largestSize) {
      predominantType = type;
      largestSize = fileTypesBySize[type];
    }
  });

  dir.type = predominantType;

  return dir;
}

export default async function test() {
  const dir = await readDir('/', {
    withFileTypes: true
  });

  return processDirectory('/', dir, 0);
}
