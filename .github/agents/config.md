# Agent Configuration for markdown-visual

## Agent Behavior Guidelines

### Code Modification Approach
- **Minimal Changes**: Make the smallest possible changes to achieve the goal
- **Security First**: Always prioritize security, especially around HTML sanitization
- **Preserve Functionality**: Never break existing Power BI visual functionality
- **Follow Patterns**: Use existing code patterns and TypeScript style

### Testing and Validation
```bash
# Essential validation steps for any change:
npm install                    # Ensure dependencies are installed
npm run lint                   # Check code style and catch issues
npm run package               # Verify the visual builds successfully

# Additional validation for UI changes:
npm run start                 # Test in development mode
# Then manually test in Power BI with various markdown content
```

### File Change Priorities
1. **High Risk**: `src/visual.ts`, `capabilities.json`, `pbiviz.json`
2. **Medium Risk**: `src/settings.ts`, `package.json`, webpack configs
3. **Low Risk**: Documentation, styling, assets

### Common Tasks and Approaches

#### Adding Features
1. Start with `capabilities.json` if new data binding is needed
2. Add settings in `src/settings.ts` for user-configurable options
3. Implement logic in `src/visual.ts`
4. Always test with multiple data scenarios

#### Bug Fixes
1. Identify the root cause (often in markdown parsing or HTML sanitization)
2. Create minimal fix in the appropriate file
3. Ensure fix doesn't break existing functionality
4. Test edge cases

#### Performance Improvements
1. Focus on the `update()` method in `visual.ts`
2. Consider caching strategies for markdown conversion
3. Monitor bundle size impacts
4. Test with large datasets

### Security Requirements
- **Never bypass DOMPurify sanitization**
- **Always validate user inputs**
- **Use `sanitizeAndSetHtml` method for HTML content**
- **Be cautious with external resource loading**

### Development Environment Setup
```bash
# Initial setup
npm install
npm run cert  # Install dev certificate if needed

# Development workflow
npm run start  # Start dev server
# Make changes
npm run lint   # Check code
npm run package # Build and test
```

### Code Style Preferences
- Use TypeScript strict mode features
- Prefer explicit types over `any`
- Use existing formatting patterns
- Follow Power BI visual best practices
- Use arrow functions for event handlers

### Error Handling Patterns
```typescript
// Always check for null/undefined data
if (!options.dataViews || !options.dataViews[0]) {
    return;
}

// Use try-catch for external library calls
try {
    const html = this.converter.makeHtml(markdown);
    const sanitizedHtml = DOMPurify.sanitize(html);
    // ... use sanitized content
} catch (error) {
    console.error("Markdown conversion failed:", error);
    // ... handle gracefully
}
```

### Performance Considerations
- Minimize DOM manipulations in `update()` method
- Cache converted markdown when data hasn't changed
- Use efficient selectors and event handling
- Monitor memory usage with large content

### Debugging Approach
1. Use browser dev tools with `npm run start`
2. Check Power BI visual error console
3. Validate data structure at each step
4. Test with minimal and complex markdown examples
5. Verify security sanitization is working

### Documentation Standards
- Update README.md for user-facing features
- Add inline comments for complex logic only
- Document breaking changes clearly
- Include examples for new features

This configuration helps ensure consistent, secure, and maintainable development practices for the markdown-visual Power BI custom visual project.