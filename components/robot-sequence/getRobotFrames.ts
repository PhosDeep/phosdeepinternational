import fs from "fs";
import path from "path";

export interface RobotFramesData {
  frameUrls: string[];
  frameCount: number;
  naturalWidth: number;
  naturalHeight: number;
}

/**
 * Automatically inspects the frames directory, detects image format,
 * sorts the frames strictly by numerical order, and returns public URLs.
 */
export function getRobotFramesData(): RobotFramesData {
  const publicDir = path.join(process.cwd(), "public", "robot-frames");
  const fallbackDir = path.join(process.cwd(), "ezgif-8436cdd28593385f-jpg");

  let targetDir = publicDir;
  let publicPrefix = "/robot-frames/";

  if (!fs.existsSync(publicDir) || fs.readdirSync(publicDir).length === 0) {
    if (fs.existsSync(fallbackDir)) {
      targetDir = fallbackDir;
      publicPrefix = "/ezgif-8436cdd28593385f-jpg/";
    }
  }

  if (!fs.existsSync(targetDir)) {
    return {
      frameUrls: [],
      frameCount: 0,
      naturalWidth: 1920,
      naturalHeight: 1080,
    };
  }

  const validExtensions = /\.(jpe?g|webp|png)$/i;

  const rawFiles = fs.readdirSync(targetDir);

  const imageFiles = rawFiles
    .filter((file) => validExtensions.test(file))
    .sort((a, b) => {
      const matchA = a.match(/\d+/);
      const matchB = b.match(/\d+/);
      const numA = matchA ? parseInt(matchA[0], 10) : 0;
      const numB = matchB ? parseInt(matchB[0], 10) : 0;
      return numA - numB;
    });

  const frameUrls = imageFiles.map((filename) => `${publicPrefix}${filename}`);

  return {
    frameUrls,
    frameCount: frameUrls.length,
    naturalWidth: 1920,
    naturalHeight: 1080,
  };
}
