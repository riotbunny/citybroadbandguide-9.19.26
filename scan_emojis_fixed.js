const fs = require('fs');
const path = require('path');

const directoryToScan = 'src';

function scanDirectory(dir) {
    let results = [];
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            results = results.concat(scanDirectory(fullPath));
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let fileIssues = [];
            let modified = false;
            
            // Check for actual corruption characters commonly produced by Powershell utf8 mangling
            if (content.includes('ÐŸ') || content.includes('') || content.includes('A,A') || content.includes('??A') || content.includes('A?A')) {
                fileIssues.push(`Real corruption detected (ÐŸ, , or A,A)`);
            }
            
            // Check for raw fire emojis and replace with safe entity
            if (content.includes('🔥')) {
                fileIssues.push(`Raw 🔥 emoji detected. Safely replacing...`);
                content = content.replace(/🔥/g, '&#128293;');
                modified = true;
            }
            
            // Check for raw trophy emojis and replace with safe entity
            if (content.includes('🏆')) {
                fileIssues.push(`Raw 🏆 emoji detected. Safely replacing...`);
                content = content.replace(/🏆/g, '&#127942;');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
            }
            
            if (fileIssues.length > 0) {
                results.push({ file: fullPath, issues: fileIssues });
            }
        }
    }
    return results;
}

const findings = scanDirectory(directoryToScan);
console.log(JSON.stringify(findings, null, 2));