#!/usr/bin/env node

import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const candidates = [
  {
    imagesDir: path.join(rootDir, "public", "images"),
    outputFile: path.join(rootDir, "src", "data", "images.json"),
  },
  {
    imagesDir: path.join(rootDir, "frontend", "public", "images"),
    outputFile: path.join(rootDir, "frontend", "src", "data", "images.json"),
  },
];

async function pathExists(targetPath) {
  try {
    await readdir(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function resolvePaths() {
  for (const candidate of candidates) {
    if (await pathExists(candidate.imagesDir)) {
      return candidate;
    }
  }

  throw new Error(
    "Kein Bildverzeichnis gefunden. Erwartet wurde entweder public/images oder frontend/public/images.",
  );
}

function toCategory(rawCategory) {
  if (!rawCategory) {
    throw new Error("Leerer Kategoriename ist nicht erlaubt.");
  }

  return rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);
}

function parseImageFilename(filename) {
  const ext = path.extname(filename);
  const basename = path.basename(filename, ext);
  const parts = basename.split(" ");

  if (parts.length < 3) {
    throw new Error(
      `Dateiname "${filename}" entspricht nicht dem erwarteten Muster "<kategorie> <farbe> <nummer>.<ext>".`,
    );
  }

  const [rawCategory, rawColor] = parts;

  return {
    url: filename,
    color: rawColor.toLowerCase(),
    category: toCategory(rawCategory),
  };
}

async function readExistingRatings(outputFile) {
  try {
    const content = await readFile(outputFile, "utf8");
    const existingEntries = JSON.parse(content);
    return new Map(
      existingEntries
        .filter((entry) => typeof entry?.url === "string" && typeof entry?.rating === "number")
        .map((entry) => [entry.url, entry.rating]),
    );
  } catch {
    return new Map();
  }
}

async function main() {
  const { imagesDir, outputFile } = await resolvePaths();
  const existingRatings = await readExistingRatings(outputFile);
  const dirEntries = await readdir(imagesDir, { withFileTypes: true });

  const imageFiles = dirEntries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((filename) => /\.(avif|gif|jpe?g|png|webp)$/i.test(filename))
    .sort((left, right) => left.localeCompare(right, "de", { numeric: true, sensitivity: "base" }));

  const images = imageFiles.map((filename, index) => {
    const parsed = parseImageFilename(filename);

    return {
      id: index,
      url: parsed.url,
      color: parsed.color,
      category: parsed.category,
      rating: existingRatings.get(filename) ?? 0,
    };
  });

  await writeFile(outputFile, `${JSON.stringify(images, null, 2)}\n`, "utf8");

  console.log(`Wrote ${images.length} image entries to ${path.relative(rootDir, outputFile)}`);
}

await main();
