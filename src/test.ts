/* eslint-disable no-await-in-loop */
import fs, { Dirent } from 'fs';
import path from 'path';
import { promisify } from 'util';

const readDir = promisify(fs.readdir);
const stat = promisify(fs.stat);

export enum KondoType {
  ApplicationFile,
  Archive,
  Audio,
  Document,
  Image,
  Other,
  SourceCode,
  Video
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
    case '.plist':
    case '.dylib':
    case '.jar':
      return KondoType.ApplicationFile;
    case '.zip':
    case '.tar':
      return KondoType.Archive;
    default:
      return KondoType.Other;
  }
}

function generateBlankChildrenSizes(): { [key in KondoType]: number } {
  return (
    Object.keys(KondoType)
      // eslint-disable-next-line no-restricted-globals
      .filter((key: any) => !isNaN(key))
      .map((key: any) => key as KondoType)
      .reduce((result, type) => ({ ...result, [type]: 0 }), {} as any)
  );
}

async function processDirectory(
  dirPath: string,
  entries: Dirent[],
  depth: number
): Promise<KondoDirectory> {
  const dir: KondoDirectory = {
    path: path.basename(dirPath) || dirPath,
    size: 0,
    type: KondoType.Other,
    children: [],
    childrenFileSizes: generateBlankChildrenSizes()
  };

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

  const fileTypesBySize = { ...dir.childrenFileSizes };
  for (const childDir of childDirs) {
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
        fileTypesBySize[childKondoDir.type] += childKondoDir.size;
      }
    } catch (err) {
      // ...
    }
  }

  let predominantType: KondoType = 0;
  let largestSize = fileTypesBySize[predominantType];
  Object.keys(fileTypesBySize)
    // eslint-disable-next-line no-restricted-globals
    .filter((key: any) => !isNaN(key))
    .map((key: any) => key)
    .forEach((type: KondoType) => {
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
