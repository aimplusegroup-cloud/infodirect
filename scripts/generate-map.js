// scripts/generate-map.js
const fs = require("fs");
const path = require("path");

const exhibitionsDir = path.join(__dirname, "../data/exhibitions");
const mapFile = path.join(__dirname, "../data/map.ts");

// همه فایل‌های داخل exhibitions (به جز index.ts) رو می‌گیریم
const files = fs.readdirSync(exhibitionsDir).filter(f => f.endsWith(".ts") && f !== "index.ts");

let imports = [];
let mappings = [];

files.forEach((file, i) => {
  const varName = "expo" + (i + 1); // اسم متغیر ساده (expo1, expo2, ...)
  const importPath = `./exhibitions/${file.replace(/\.ts$/, "")}`;
  imports.push(`import ${varName} from "${importPath}"`);

  // کلید map همون اسم فایل (بدون .ts) خواهد بود
  const exhibitionName = file.replace(/\.ts$/, "");
  mappings.push(`  "${exhibitionName}": ${varName},`);
});

const content = `// ⚠️ این فایل به صورت خودکار تولید شده است. دستی ویرایش نکنید.

${imports.join("\n")}

export const exhibitionDataMap: Record<string, any[]> = {
${mappings.join("\n")}
}
`;

fs.writeFileSync(mapFile, content, "utf8");
console.log("✅ map.ts ساخته شد!");
