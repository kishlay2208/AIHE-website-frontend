const fs = require('fs');
const path = require('path');

const filesToDelete = [
  'src/contexts/AuthContext.tsx',
  'src/components/AuthDialog.tsx',
  'src/components/RegistrationDialog.tsx',
  'src/components/CartSheet.tsx',
  'src/pages/dashboard',
  'src/components/lms'
];

filesToDelete.forEach(f => {
  const fullPath = path.resolve(__dirname, f);
  if (fs.existsSync(fullPath)) {
    if (fs.lstatSync(fullPath).isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }
    console.log(`Deleted: ${f}`);
  } else {
    console.log(`Not found: ${f}`);
  }
});
