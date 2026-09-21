const fs = require('fs');
const file = 'src/components/SpeedTestWidget.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace Ping
content = content.replace(
  /setPing\(Math\.floor\(Math\.random\(\) \* 30\) \+ 12\);/,
  'setPing(Math.floor(Math.random() * 38) + 18); // 18-56ms (Realistic Cable/DSL Ping)'
);

// Replace Download Target and Jitter
content = content.replace(
  /const downTarget = Math\.floor\(Math\.random\(\) \* 800\) \+ 150;[\s\S]*?downVal \+= \(downTarget - downVal\) \* 0\.2 \+ \(Math\.random\(\) \* 20\);/m,
  `const downTarget = Math.floor(Math.random() * 220) + 45; // 45-265 Mbps (Realistic US Average)
      const downInterval = setInterval(() => {
        downVal += (downTarget - downVal) * 0.15 + (Math.random() * 5);`
);

// Replace Upload Target and Jitter
content = content.replace(
  /const upTarget = Math\.floor\(Math\.random\(\) \* 200\) \+ 20;[\s\S]*?upVal \+= \(upTarget - upVal\) \* 0\.2 \+ \(Math\.random\(\) \* 5\);/m,
  `const upTarget = Math.floor(Math.random() * 25) + 10; // 10-35 Mbps (Realistic Asymmetrical Cable Upload)
          const upInterval = setInterval(() => {
            upVal += (upTarget - upVal) * 0.15 + (Math.random() * 2);`
);

fs.writeFileSync(file, content);