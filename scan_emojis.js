const fs = require('fs');
const path = require('path');

const directoryToScan = 'src';

// Known mangled patterns
const mangledRegex = /(?:A,|ÐŸ||\?\?A|A\?|sA,|A|A,A)/g;

// Emoji regex (basic range for common emojis if we want to replace them with entities)
// Note: We might want to keep some emojis if they are safe, but user wants to ensure no weird coding.
const rawEmojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

function scanDirectory(dir) {
    let results = [];
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            results = results.concat(scanDirectory(fullPath));
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            let fileIssues = [];
            
            // Check for mangled strings
            const mangledMatches = content.match(mangledRegex);
            if (mangledMatches && mangledMatches.length > 0) {
                // Filter out false positives like "A," if it's just normal text, but let's log to be safe
                if (content.includes('ÐŸ') || content.includes('') || content.includes('A') || content.includes('??A')) {
                     fileIssues.push(`Mangled UTF-8 detected`);
                }
            }
            
            // Check for raw emojis
            const emojiMatches = content.match(rawEmojiRegex);
            if (emojiMatches && emojiMatches.length > 0) {
                fileIssues.push(`Raw Emojis detected: ${[...new Set(emojiMatches)].join(' ')}`);
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