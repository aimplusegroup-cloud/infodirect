const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../data/exhibitions");

const files = fs.readdirSync(dir).filter(f => f.endsWith(".ts") && f !== "index.ts");

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf8");

  if (content.includes("sample")) {
    // 👇 این regex باید دقیقاً در یک خط باشه
    const regex = /export const exhibitions\s*=\s*\[[\s\S]*?sample\s*:\s*(\[[\s\S]*?\])[\s\S]*?\];?/;
    content = content.replace(
      regex,
      `const data = $1;\n\nexport default data;`
    );

    fs.writeFileSync(filePath, content, "utf8");
    console.log("✅ تبدیل شد:", file);
  }
});
