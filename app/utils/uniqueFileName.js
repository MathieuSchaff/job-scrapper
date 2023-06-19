import fs from "fs";

export default function getUniqueFilename(
  basePath,
  filename,
  extension = ".json"
) {
  let counter = 1;
  let newFilename = `${filename}${extension}`;

  while (fs.existsSync(`${basePath}/${newFilename}`)) {
    newFilename = `${filename}-${counter}${extension}`;
    counter += 1;
  }

  return newFilename;
}
