import { type Prisma } from "@prisma/client";

export function compareJsonKeys(
  json1: Prisma.JsonValue,
  json2: Prisma.JsonValue,
): boolean {
  // Periksa apakah salah satu dari json1 atau json2 adalah null
  if (json1 === null || json2 === null) {
    return false;
  }

  // Pastikan bahwa keduanya adalah objek sebelum memeriksa key-nya
  if (typeof json1 !== "object" || typeof json2 !== "object") {
    return false;
  }

  const keys1 = Object.keys(json1 as Record<string, unknown>);
  const keys2 = Object.keys(json2 as Record<string, unknown>);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key) => keys2.includes(key));
}
