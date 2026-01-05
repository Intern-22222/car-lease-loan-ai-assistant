function cleanOcrText(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return "";
  }

  let cleanedText = rawText;
  cleanedText = cleanedText.replace(/[\x00-\x1F\x7F]/g, "");
  cleanedText = cleanedText.replace(/\s+/g, " ");
  cleanedText = cleanedText.trim();

  cleanedText = cleanedText.replace(/-\s+/g, "");
  cleanedText = cleanedText.replace(/(\w)\s*\n\s*(\w)/g, "$1 $2");

  cleanedText = cleanedText.replace(/₹/g, "Rs");
  cleanedText = cleanedText.replace(/\bINR\b/gi, "Rs");
  cleanedText = cleanedText.replace(/\bRs\.?/gi, "Rs");
  cleanedText = cleanedText.replace(/Rs\s*[:\-\/]?/gi, "Rs ");

  cleanedText = cleanedText.replace(/[“”]/g, '"');
  cleanedText = cleanedText.replace(/[‘’]/g, "'");
  cleanedText = cleanedText.replace(/[–—]/g, "-");

  cleanedText = cleanedText.replace(/(\d)[, ]+(?=\d)/g, "$1");
  cleanedText = cleanedText.replace(/(\d)\/-/g, "$1");
  cleanedText = cleanedText.replace(/(\d)\s+\.(\d)/g, "$1.$2");

  let parts = cleanedText.split(/\s+/);
  let filteredParts = [];
  for (let i = 0; i < parts.length; i++) {
    if (i === 0 || parts[i].toLowerCase() !== parts[i - 1].toLowerCase()) {
      filteredParts.push(parts[i]);
    }
  }
  cleanedText = filteredParts.join(" ");

  let preservedTokens = [];
  cleanedText = cleanedText.replace(/\b([A-Z]{2,})\b/g, (match) => {
    preservedTokens.push(match);
    return `__PRESERVE_${preservedTokens.length - 1}__`;
  });

  let hadRupeePrefix = false;
  if (cleanedText.includes("Rs ")) {
    hadRupeePrefix = true;
  }
  cleanedText = cleanedText.toLowerCase();
  if (hadRupeePrefix) {
    cleanedText = cleanedText.replace(/rs /g, "Rs ");
  }
  cleanedText = cleanedText.replace(/__PRESERVE_(\d+)__/g, (matchindex) => {
    return preservedTokens[index];
  });

  cleanedText = cleanedText.replace(/\n+/g, "\n");
  let lines = cleanedText.split("\n");
  let markedLines = [];

  for (let line of lines) {
    let trimmed = line.trim();
    if (/^[A-Z][A-Za-z0-9 ,.&()%/-]{2,}$/.test(trimmed)) {
      markedLines.push(`__SECTION_START__ ${trimmed} __SECTION_END__`);
    } else {
      markedLines.push(line);
    }
  }
  cleanedText = markedLines.join("\n");

  if (typeof cleanedText !== "string") {
    cleanedText = "";
  }
  cleanedText = cleanedText.replace(/\s+/g, " ").trim();
  if (cleanedText.length > 200000) {
    cleanedText = cleanedText.slice(0, 200000);
  }

  // TODO: enable logging for debugging later if needed
  // console.log("Cleaned OCR text preview:", cleanedText.slice(0, 500));

  return cleanedText;
}

module.exports = cleanOcrText;

