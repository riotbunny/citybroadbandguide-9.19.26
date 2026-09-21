const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('new PrismaClient()')) {
    // Determine relative path to lib/prisma
    const dir = path.dirname(filePath);
    const depth = dir.split(path.sep).length - 1; // approx
    // Instead of relative, just use alias if possible, but let's use relative to be safe or standard @/lib
    
    content = content.replace(/import \{ PrismaClient \} from '@prisma\/client';[\s\S]*?const prisma = new PrismaClient\(\)?;?/m, 'import prisma from "@/lib/prisma";');
    fs.writeFileSync(filePath, content);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir('src');