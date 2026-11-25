import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I am the designated driver tonight. You are drunk on leverage, it is 3 AM, and I am keeping the keys until sunrise sobers you up.";

// Gate check: the competition gate requires entry.txt to be UTF-8 text of
// 1 to 200 characters, not whitespace-only, on a single line.
function validateEntry(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`entry length ${line.length} outside the 1-200 gate`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry is whitespace-only");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (line.includes("\u2014")) {
    throw new Error("entry must not contain an em dash");
  }
}

validateEntry(LINE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE + "\n", "utf8");

// Read back what was written and verify it byte for byte.
const written = readFileSync(outPath, "utf8");
if (written !== LINE + "\n") {
  throw new Error("read-back mismatch: entry.txt does not match the line");
}
const digest = createHash("sha256").update(written, "utf8").digest("hex");
console.log(`wrote ${outPath} (${LINE.length} chars, sha256 ${digest})`);
