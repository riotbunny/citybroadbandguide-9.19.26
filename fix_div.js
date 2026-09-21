const fs = require('fs');
const file = 'src/app/admin/carriers/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The missing </div> for the table wrapper
content = content.replace(
  /<\/tbody>\s*<\/table>\s*<\/div>\s*\) : \(/,
  '</tbody></table></div></div>) : ('
);

// If the above fails because the existing div is attached differently:
content = content.replace(
  /<\/tbody>\r?\n\s*<\/table>\r?\n\s*<\/div>\r?\n\s*\) : \(/,
  '</tbody>\n            </table>\n          </div>\n          </div>\n        ) : ('
);

fs.writeFileSync(file, content);