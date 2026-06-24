const fs = require('fs');

try {
  let rawData = fs.readFileSync('test-results.json', 'utf8');
  const jsonStart = rawData.indexOf('{\n  "stats":');
  rawData = rawData.substring(jsonStart);
  const results = JSON.parse(rawData);

  let md = '# Laporan Hasil Eksekusi API Testing\n\n';
  md += `> **Ringkasan:**\n`;
  md += `> - **Total Pengujian:** ${results.stats.tests}\n`;
  md += `> - **Berhasil (Passed):** ✅ ${results.stats.passes}\n`;
  md += `> - **Gagal (Failed):** ❌ ${results.stats.failures}\n`;
  md += `> - **Total Waktu Eksekusi:** ⏱️ ${results.stats.duration}ms\n\n`;

  md += '### Detail Pengujian\n\n';
  md += '| Status | Kategori Pengujian | Nama Skenario Uji | Actual Result | Waktu (ms) |\n';
  md += '|:---:|---|---|---|:---:|\n';

  let actualResults = {};
  try {
    actualResults = JSON.parse(fs.readFileSync('actual-results.json', 'utf8'));
  } catch(e) {
    console.log('No actual-results.json found');
  }

  results.tests.forEach(test => {
    const isPassed = !test.err || Object.keys(test.err).length === 0;
    const statusIcon = isPassed ? '✅ Pass' : '❌ Fail';
    
    // Extract actual result
    let actualResult = actualResults[test.title] || 'N/A';
    if (!isPassed && test.err) {
      actualResult += `<br/><b>Error:</b> ${test.err.message ? test.err.message.replace(/\\n/g, ' ') : 'Terjadi Kesalahan'}`;
    }
    
    // Extract suite name from fullTitle by removing the test title
    const suiteName = test.fullTitle.replace(test.title, '').trim();

    md += `| ${statusIcon} | ${suiteName} | ${test.title} | ${actualResult} | ${test.duration || 0}ms |\n`;
  });

  fs.writeFileSync('Test-Results.md', md);
  console.log('Test-Results.md generated successfully.');
} catch (e) {
  console.error('Failed to parse test results:', e);
}
