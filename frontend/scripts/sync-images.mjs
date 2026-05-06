import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");
const imagesDir = path.join(frontendRoot, "public", "images");
const categoriesFile = path.join(frontendRoot, "src", "data", "categories.ts");
const outputFile = path.join(frontendRoot, "src", "data", "images.ts");

const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const COLOR_TOKENS = new Set(["hell", "dunkel", "mix"]);

const normalizeCategoryKey = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

const compareNaturally = (left, right) =>
  left.localeCompare(right, "de", { numeric: true, sensitivity: "base" });

const readCategoryKeys = async () => {
  const contents = await readFile(categoriesFile, "utf8");
  const matches = contents.matchAll(/^\s*([a-zA-Z0-9_äöüÄÖÜß]+):\s*\{/gm);

  return new Set(Array.from(matches, ([, key]) => key));
};

const parseImageFile = (fileName, categoryKeys) => {
  const extension = path.extname(fileName).toLowerCase();

  if (!SUPPORTED_EXTENSIONS.has(extension)) {
    return null;
  }

  const baseName = path.basename(fileName, extension);
  const parts = baseName.split(" ");
  const colorIndex = parts.findIndex((part) => COLOR_TOKENS.has(part));

  if (colorIndex <= 0 || colorIndex >= parts.length - 1) {
    throw new Error(`Unsupported image filename format: ${fileName}`);
  }

  const categoryName = parts.slice(0, colorIndex).join(" ");
  const color = parts[colorIndex];
  const sequence = parts.slice(colorIndex + 1).join(" ");
  const categoryKey = normalizeCategoryKey(categoryName);

  if (!categoryKeys.has(categoryKey)) {
    throw new Error(`No category key found for image "${fileName}" -> "${categoryKey}"`);
  }

  return {
    fileName,
    categoryKey,
    color,
    sortKey: `${categoryKey} ${color} ${sequence}`,
  };
};

const createFileContents = (images) => {
  const items = images
    .map(
      (image, index) =>
        `  createImage(${index}, "/images/${image.fileName}", "${image.color}", CATEGORIES.${image.categoryKey}),`,
    )
    .join("\n");

  return `import type { CompassImage } from "../types/domain";
import { CATEGORIES } from "./categories";

const createImage = (
  id: number,
  url: string,
  color: CompassImage["color"],
  category: CompassImage["categories"][number]
): CompassImage => ({
  id,
  url,
  color,
  categories: [category],
  rating: 0,
});

export const IMAGES: CompassImage[] = [
${items}
];
`;
};

const main = async () => {
  const categoryKeys = await readCategoryKeys();
  const entries = await readdir(imagesDir, { withFileTypes: true });
  const images = entries
    .filter((entry) => entry.isFile())
    .map((entry) => parseImageFile(entry.name, categoryKeys))
    .filter(Boolean)
    .sort((left, right) => compareNaturally(left.sortKey, right.sortKey));

  const contents = createFileContents(images);
  await writeFile(outputFile, contents, "utf8");

  console.log(`Updated ${path.relative(frontendRoot, outputFile)} with ${images.length} images.`);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
