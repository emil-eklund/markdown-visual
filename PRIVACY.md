# Privacy Policy

**Last Updated**: September 2025

## Overview

The Markdown Visual for Power BI ("the Visual") is a custom visual component that renders markdown content within Power BI reports. This privacy policy explains how the Visual handles data provided to it through the Power BI platform.

## Data We Process

### Input Data
The Visual processes the following types of data:
- **Markdown Text Content**: Plain text content in markdown format that you provide through Power BI datasets
- **Formatting Preferences**: Visual formatting settings such as font size, font family, colors, and background color
- **Configuration Data**: Settings related to the visual's appearance and behavior

### Generated Content
During operation, the Visual generates:
- **HTML Content**: Markdown text is converted to HTML for display purposes
- **SVG Diagrams**: Mermaid diagram code within markdown is rendered as SVG graphics
- **Sanitized Content**: All HTML content is processed through security sanitization

## How We Handle Your Data

### Data Processing
- **Local Processing Only**: All data processing occurs entirely within your browser/Power BI environment
- **No Data Transmission**: The Visual does not send your data to any external servers or third-party services
- **Real-time Conversion**: Markdown content is converted to HTML in real-time for display purposes only
- **Security Sanitization**: All generated HTML content is sanitized using DOMPurify to remove potentially malicious content

### Data Storage
- **No Persistent Storage**: The Visual does not store any of your data permanently
- **No Local Storage**: No data is saved to browser local storage or cookies
- **Session-only Processing**: Data exists only during the active Power BI session

### External Communications
- **Link Handling**: When you click on links within the rendered markdown, they are opened through Power BI's secure link handling mechanism
- **External Image Fetching**: The Visual may fetch external images referenced in markdown content (e.g., `![alt](https://example.com/image.png)`). When images are loaded from external sources:
  - Image requests are made directly from your browser to the image host
  - The Visual itself does not track or log these requests
  - However, external image hosts may track image requests according to their own privacy policies
  - Consider using local or trusted image sources for sensitive content
- **No Analytics**: The Visual does not collect usage analytics or telemetry data
- **No Third-party Integrations**: No data is shared with external services or APIs beyond standard web image loading

## Security Measures

### Content Sanitization
- All HTML content generated from markdown is processed through DOMPurify, a leading HTML sanitization library
- Malicious scripts, unsafe HTML elements, and potentially harmful content are automatically removed
- Mermaid diagrams are rendered in a controlled environment to prevent code execution

### Power BI Integration
- The Visual operates within Power BI's security sandbox
- All external link access is handled through Power BI's secure mechanisms
- The Visual requires WebAccess privilege to fetch external images referenced in markdown content
- WebAccess permissions are managed by Power BI's permission system and may be restricted by administrators

## Your Data Rights

### Control Over Data
- You maintain full control over the markdown content you provide to the Visual
- You can modify or remove content at any time through your Power BI dataset
- No data processing occurs without your explicit input

### Transparency
- The Visual's source code is open source and available for inspection
- All data processing logic is transparent and auditable
- No hidden data collection or processing occurs

## Third-party Components

The Visual uses the following third-party libraries, all of which operate locally within your browser:

### Processing Libraries
- **Showdown.js**: Converts markdown to HTML (operates locally, no external requests)
- **DOMPurify**: Sanitizes HTML content for security (operates locally, no external requests)
- **Mermaid**: Renders diagrams from text descriptions (operates locally, no external requests)

### Microsoft Libraries
- **Power BI Visuals API**: Interfaces with Power BI platform
- **Power BI Visuals Utils**: Provides formatting and utility functions

## Compliance

### Data Protection
- The Visual is designed to comply with data protection regulations including GDPR, CCPA, and other privacy laws
- No personal data is collected, stored, or transmitted by the Visual itself
- Data protection compliance is primarily governed by your Power BI environment and data handling practices

### Enterprise Security
- The Visual operates within enterprise Power BI security policies
- All security measures are implemented according to Microsoft Power BI security standards
- No additional security vulnerabilities are introduced beyond standard web content rendering

## Contact Information

For questions about this privacy policy or the Visual's data handling:

- **GitHub Repository**: [https://github.com/emil-eklund/markdown-visual](https://github.com/emil-eklund/markdown-visual)
- **Issues and Support**: [https://github.com/emil-eklund/markdown-visual/issues](https://github.com/emil-eklund/markdown-visual/issues)
- **Developer**: Emil Eklund

## Changes to This Policy

We may update this privacy policy from time to time. When we do:
- We will update the "Last Updated" date at the top of this policy
- Significant changes will be communicated through the GitHub repository
- We recommend reviewing this policy periodically for any changes

## Disclaimer

This Visual is provided as-is under the MIT License. While we implement security best practices, users should:
- Review and validate any markdown content before using it in the Visual
- Be aware that external images in markdown may be tracked by their respective hosts
- Consider using local or trusted image sources for sensitive content
- Follow their organization's data governance policies
- Ensure compliance with applicable data protection regulations

For the most current version of this privacy policy, please visit our GitHub repository.