# Power BI Visual Development Patterns

## Visual Lifecycle Methods

### constructor(options: VisualConstructorOptions)
- Initialize services (host, selectionManager, etc.)
- Set up event handlers
- Create DOM structure
- Initialize libraries (Showdown converter, Mermaid)

### update(options: VisualUpdateOptions)
- **Most important method** - called when data or settings change
- Check for valid data before processing
- Extract markdown content from data binding
- Convert markdown to HTML using Showdown
- Sanitize HTML using DOMPurify
- Apply formatting settings
- Update DOM efficiently

### getFormattingModel()
- Return current formatting settings
- Used by Power BI property panel
- Should return `this.formattingSettings`

## Data Binding Patterns

### Single Value Data Role
```typescript
// Check for valid data structure
if (!options.dataViews?.[0]?.single?.value) {
    this.target.innerHTML = "";
    return;
}

const markdownText = options.dataViews[0].single.value.toString();
```

### Table Data Role (if needed)
```typescript
// For future enhancements with multiple values
if (!options.dataViews?.[0]?.table?.rows) {
    return;
}

const rows = options.dataViews[0].table.rows;
```

## Security Patterns

### HTML Sanitization
```typescript
// Always sanitize before setting innerHTML
const html = this.converter.makeHtml(markdownText);
const sanitizedHtml = DOMPurify.sanitize(html);
this.target.innerHTML = sanitizedHtml;
```

### External Resource Handling
```typescript
// Be cautious with external images/links
// They are allowed but note privacy implications
// Current implementation allows external image fetching
```

## Performance Patterns

### Caching Strategy
```typescript
// Cache converted content to avoid unnecessary re-processing
private lastMarkdown: string = "";
private lastHtml: string = "";

if (markdownText !== this.lastMarkdown) {
    this.lastHtml = this.converter.makeHtml(markdownText);
    this.lastMarkdown = markdownText;
}
```

### Efficient DOM Updates
```typescript
// Only update DOM when necessary
if (this.target.innerHTML !== sanitizedHtml) {
    this.target.innerHTML = sanitizedHtml;
}
```

## Formatting Settings Patterns

### Adding New Settings
1. Add property to `FormatCardSettings` class in `settings.ts`
2. Use appropriate setting type (ColorPicker, NumUpDown, etc.)
3. Apply setting in `visual.ts` update method
4. Test in Power BI property panel

### Setting Types Examples
```typescript
// Color setting
fontColor = new formattingSettings.ColorPicker({
    name: "fontColor",
    displayName: "Text Color",
    value: { value: "#000000" }
});

// Number setting
fontSize = new formattingSettings.NumUpDown({
    name: "fontSize",
    displayName: "Font Size",
    value: 14,
    options: { minValue: { value: 8 }, maxValue: { value: 72 } }
});

// Boolean setting
enableFeature = new formattingSettings.ToggleSwitch({
    name: "enableFeature",
    displayName: "Enable Feature",
    value: false
});
```

## Error Handling Patterns

### Graceful Degradation
```typescript
try {
    const html = this.converter.makeHtml(markdownText);
    const sanitizedHtml = DOMPurify.sanitize(html);
    this.target.innerHTML = sanitizedHtml;
} catch (error) {
    console.error("Markdown processing failed:", error);
    this.target.textContent = markdownText; // Fallback to plain text
}
```

### Data Validation
```typescript
// Always validate data structure
if (!options?.dataViews?.length) {
    this.clearVisual();
    return;
}

const dataView = options.dataViews[0];
if (!dataView?.single?.value) {
    this.clearVisual();
    return;
}
```

## Event Handling Patterns

### Context Menu
```typescript
// Right-click context menu support
private handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    const position = { x: event.clientX, y: event.clientY };
    this.selectionManager.showContextMenu([], position);
};
```

### Selection Management
```typescript
// Handle visual selection (if needed)
this.selectionManager.registerOnSelectCallback(() => {
    // Handle selection change
});
```

## Common Debugging Techniques

1. **Console Logging**: Use `console.log()` in development
2. **Data Inspection**: Log data structure to understand format
3. **Browser DevTools**: Inspect DOM and network requests
4. **Power BI DevTools**: Use visual debugging features
5. **Step-by-step**: Break down update() method execution

## Version Management

### Package Version Updates
- Update `version` in `pbiviz.json`
- Consider semantic versioning
- Document changes in commits
- Test thoroughly before releasing

These patterns ensure consistent, secure, and maintainable Power BI visual development.