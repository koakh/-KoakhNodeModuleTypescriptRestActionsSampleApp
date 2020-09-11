import fs from 'fs';

/**
 * check if file exists
 */
export const fileExist = (filePath: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      if (fs.existsSync(filePath)) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * simple helper method to check if is a valid directory
 * @param dirPath
 */
export const isDirectory = (dirPath: string): Promise<boolean> => new Promise((resolve, reject) => {
  try {
    fs.lstat(dirPath, (error: NodeJS.ErrnoException, stats: fs.Stats) => {
      if (error) {
        // reject(error);
        resolve(false);
      } else {
        resolve(stats.isDirectory());
      }
    });
  } catch (error) {
    reject(error);
  }
});

/**
 * create directory helper
 * @param dirPath
 */
export const mkDirectory = (dirPath: string): Promise<boolean> => new Promise((resolve, reject) => {
  fs.mkdir(dirPath, { recursive: true }, (mkdirError) => {
    if (mkdirError) {
      reject(mkdirError);
    } else {
      resolve(true);
    }
  });
});
