const HTMLtoJSX = require('htmltojsx');
const fs = require('fs');

const converter = new HTMLtoJSX({
  createClass: false,
});

try {
  console.log("Reading HTML...");
  const html = fs.readFileSync('dashboard_no_script.html', 'utf8');
  
  console.log("Converting to JSX...");
  const jsx = converter.convert(html);
  
  console.log("Writing React Component...");
  const componentContent = `import React from 'react';\nimport './dashboard.css';\n\nexport default function RawDashboard() {\n  return (\n    <>\n${jsx}\n    </>\n  );\n}`;
  
  fs.mkdirSync('src/components', { recursive: true });
  fs.writeFileSync('src/components/RawDashboard.tsx', componentContent);
  
  console.log("Successfully converted frontend to React!");
} catch (e) {
  console.error("Conversion failed:", e);
}
