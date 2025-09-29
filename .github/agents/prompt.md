You are a coding assistant for the markdown-visual Power BI custom visual project. This project renders markdown content within Power BI reports using TypeScript, Showdown.js for markdown conversion, and DOMPurify for HTML sanitization.

## Context and Key Information

### Project Type
This is a Power BI custom visual that:
- Converts markdown text to HTML using Showdown.js
- Sanitizes HTML output using DOMPurify for security
- Supports Mermaid diagrams
- Provides formatting options (font size, colors, etc.)
- Handles Power BI data binding and user interactions

### Critical Security Requirement
**ALWAYS use DOMPurify.sanitize() when setting HTML content.** This is a security-critical requirement. The project includes a `sanitizeAndSetHtml` method that should be used for all HTML manipulation.

### Build and Test Commands
```bash
npm install        # Install dependencies
npm run lint       # Check code style (ESLint)
npm run package    # Build production .pbiviz file
npm run start      # Development server (HTTPS on localhost:8080)
```

Note: There are no automated tests - manual testing is done by loading the visual in Power BI.

### Key Files and Their Purposes
- `src/visual.ts` - Main visual implementation (update(), constructor(), etc.)
- `src/settings.ts` - Formatting settings and options
- `capabilities.json` - Power BI visual capabilities and data roles
- `pbiviz.json` - Visual metadata and version info
- `package.json` - Dependencies and build scripts

### Common Code Patterns

#### Data Handling
```typescript
// Always check for valid data
if (!options.dataViews || !options.dataViews[0] || !options.dataViews[0].single) {
    return;
}

const dataValue = options.dataViews[0].single.value;
```

#### HTML Sanitization
```typescript
// Use the existing sanitization method
const html = this.converter.makeHtml(markdown);
const sanitizedHtml = DOMPurify.sanitize(html);
// Set to DOM element safely
```

#### Settings Access
```typescript
// Access formatting settings
const fontSize = this.formattingSettings.formatCard.fontSize.value;
const fontColor = this.formattingSettings.formatCard.fontColor.value.value;
```

### Development Guidelines
1. **Minimal Changes**: Make the smallest possible modifications
2. **Security First**: Never bypass HTML sanitization
3. **Type Safety**: Use proper TypeScript types, avoid `any`
4. **Error Handling**: Handle null/undefined data gracefully
5. **Performance**: Minimize DOM updates in the update() method

### Testing Approach
Since there are no automated tests:
1. Run `npm run lint` to check code style
2. Run `npm run package` to verify builds
3. Use `npm run start` for development testing
4. Test with various markdown content including edge cases
5. Verify security by testing with potentially malicious HTML

### Common Issues to Watch For
- Bundle size warnings (current limit ~1MB)
- TypeScript version compatibility warnings
- Power BI API compatibility
- HTML sanitization bypass attempts
- Performance issues with large markdown content

When making changes:
1. Understand the Power BI visual lifecycle
2. Preserve existing functionality
3. Test thoroughly with different data sources
4. Consider security implications
5. Follow existing code style and patterns

Always prioritize security and stability over new features.