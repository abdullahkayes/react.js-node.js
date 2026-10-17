const fs = require('fs');
const content = fs.readFileSync('src/pages/services/AssistedPurchase.jsx', 'utf8');
const lines = content.split('\n');
let divBalance = 0;
lines.forEach((line, i) => {
  const opens = (line.match(/<div/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  divBalance += opens - closes;
  if (closes > 0) {
    console.log(`Line ${i+1}: balance=${divBalance}, closes=${closes}, line=${line.trim().substring(0, 60)}`);
  }
});
console.log('Final balance:', divBalance);
