export function makeSummaryPrompt(relPath: string, ext: string, text: string, notes?: string) {
  const preview = text.length > 120000
    ? text.slice(0, 120000) + "\n\n...[truncated]"
    : text;

  const noteLine = notes ? "Note: " + notes + "\n\n" : "";

  return `${noteLine}You are an expert summarizer.
File: ${relPath}
Extension: ${ext}

Produce markdown with:

Summary: one short paragraph.
Key Points: 4 to 6 bullets.
Suggested Tags: 3 to 6 tags.

Content:
\`\`\`
${preview}
\`\`\`
`;
}
