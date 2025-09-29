# Copilot Agent Instructions for markdown-visual

## Project Overview
This repository contains a Power BI custom visual that renders markdown content. It's built with TypeScript, uses webpack for bundling, and creates `.pbiviz` files for Power BI integration.

## Key Technologies
- **TypeScript**: Primary language for the visual implementation
- **Power BI Visuals API**: Core framework for creating Power BI custom visuals
- **Showdown.js**: Markdown to HTML conversion library
- **DOMPurify**: HTML sanitization for security
- **Mermaid**: Diagram rendering support
- **Webpack**: Module bundler and build tool
- **ESLint**: Code linting and style checking

## Project Structure
```
├── src/                    # TypeScript source files
│   ├── visual.ts          # Main visual implementation
│   └── settings.ts        # Visual formatting settings
├── style/                 # CSS/LESS styling
├── assets/               # Static assets
├── stringResources/      # Localization resources
├── capabilities.json     # Power BI visual capabilities definition
├── pbiviz.json          # Power BI visual metadata
├── package.json         # Node.js dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── webpack.config.js    # Webpack build configuration
└── .eslintrc.js        # ESLint configuration
```

## Development Workflow

### Available Commands
```bash
# Install dependencies
npm install

# Start development server (HTTPS on localhost:8080)
npm run start

# Build production package (.pbiviz file in dist/)
npm run package

# Run linting
npm run lint

# Install development certificate (one-time setup)
npm run cert
```

### Build Process
1. **Dependencies**: Always run `npm install` after pulling changes
2. **Development**: Use `npm run start` for live development with hot reload
3. **Production**: Use `npm run package` to create the final `.pbiviz` file
4. **Linting**: Run `npm run lint` before committing changes

### Testing
- **No automated test suite currently exists**
- Manual testing is done by loading the visual in Power BI
- Test with various markdown content including:
  - Headers, lists, links, bold/italic text
  - Code blocks and syntax highlighting
  - Mermaid diagrams
  - HTML content (should be sanitized)

## Code Guidelines

### TypeScript Standards
- Follow existing code style and patterns
- Use proper typing - avoid `any` types
- Import types explicitly when needed
- Use arrow functions for class methods when appropriate

### Power BI Visual Patterns
- Main logic goes in `src/visual.ts`
- Settings and formatting options in `src/settings.ts`
- Always handle null/undefined data gracefully
- Use the Power BI event service for performance tracking
- Implement proper context menu handling

### Security Considerations
- **Critical**: Always use `DOMPurify.sanitize()` before setting HTML content
- Use the existing `sanitizeAndSetHtml` method for HTML manipulation
- Be cautious with external resources and user-provided content
- Test with potentially malicious markdown/HTML inputs

### Performance Best Practices
- Minimize re-rendering in the `update()` method
- Cache markdown conversion results when possible
- Use efficient DOM manipulation techniques
- Monitor bundle size (current limit warnings at 1MB)

## Common Development Tasks

### Adding New Formatting Options
1. Add properties to `FormatCardSettings` class in `settings.ts`
2. Update the visual rendering logic in `visual.ts`
3. Test with various values in Power BI

### Debugging
- Use browser developer tools when running `npm run start`
- Check browser console for Power BI visual errors
- Use the Power BI visual debugging tools
- Test with different data sources and field types

### Updating Dependencies
- Be cautious with Power BI API version updates
- Test thoroughly after any dependency changes
- Monitor bundle size impact
- Ensure TypeScript compatibility

## File Modification Guidelines

### Core Files (Modify with caution)
- `src/visual.ts` - Main visual implementation
- `src/settings.ts` - Visual settings and formatting
- `capabilities.json` - Power BI visual capabilities
- `pbiviz.json` - Visual metadata and versioning

### Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript compiler options
- `webpack.config.js` - Build configuration
- `.eslintrc.js` - Linting rules

### Documentation
- `README.md` - User-facing documentation
- `PRIVACY.md` - Privacy policy and data handling

## Deployment
- Production builds create a `.pbiviz` file in the `dist/` directory
- This file is imported into Power BI through the custom visuals interface
- Version numbers are managed in `pbiviz.json`
- Releases are typically published through GitHub releases

## Troubleshooting

### Common Issues
1. **Build failures**: Check TypeScript errors and dependency versions
2. **Visual not loading**: Verify capabilities.json and pbiviz.json syntax
3. **Performance issues**: Check bundle size and optimization settings
4. **Security errors**: Ensure all HTML content is properly sanitized

### Development Environment
- Requires Node.js and npm
- HTTPS development server for Power BI compatibility
- May require trusted development certificate installation

## Contributing Guidelines
- Follow existing code patterns and styles
- Run linting before submitting changes
- Test changes thoroughly in Power BI environment
- Update documentation for user-facing changes
- Consider security implications of any HTML/markdown processing changes