---
description: "Generate a professional Pull Request description based on the current changes."
name: "PR Description Generator"
argument-hint: "Add any specific context or focus for the PR..."
tools: [search, read, execute]
---
Analyze the current staged changes and generate a comprehensive Pull Request description.

## Requirements
- **Title**: A concise, descriptive title.
- **Summary**: A high-level overview of the changes and why they were made.
- **Changes**: A bulleted list of key technical changes, grouped by component or feature.
- **Testing**: Describe how these changes were tested (or should be tested).
- **Security**: Highlight any security-relevant changes or considerations.

## Steps
1. Use `git diff --cached` (via `execute`) to see the changes.
2. Read relevant files to understand the context of the changes.
3. Generate the description following the format above.

## Output Format
Return the PR description in a well-formatted Markdown block, ready to be copied into GitHub.
