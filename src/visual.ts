import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualEventService = powerbi.extensibility.IVisualEventService;

import { VisualFormattingSettingsModel } from "./settings";
import { Converter } from "showdown";
import DOMPurify from 'dompurify';
import mermaid, { RenderResult } from 'mermaid';

import ILocalizationManager = powerbi.extensibility.ILocalizationManager;

export class Visual implements IVisual {
    private formattingSettings: VisualFormattingSettingsModel;

    private localizationManager: ILocalizationManager;

    private readonly target: HTMLElement;
    private readonly formattingSettingsService: FormattingSettingsService;
    private readonly converter: Converter;
    private readonly host: powerbi.extensibility.visual.IVisualHost;
    private events: IVisualEventService;

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.localizationManager = options.host.createLocalizationManager();
        this.formattingSettingsService = new FormattingSettingsService(this.localizationManager);
        const container = document.createElement("div");
        container.classList.add("container", "github");
        options.element.appendChild(container);
        this.target = container;
        this.converter = new Converter();
        this.converter.setFlavor("github");
        this.events = options.host.eventService;

        mermaid.initialize({
            startOnLoad: false
        });
    }

    public update(options: VisualUpdateOptions) {
        // indicates that the rendering as started
        this.events.renderingStarted(options);

        void this.handleUpdate(options);
    }

    private async handleUpdate(options: VisualUpdateOptions): Promise<void> {
        try {
            this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews);

            if (!hasFlag(options.type, powerbi.VisualUpdateType.Data)) {
                return;
            }

            const value = options.dataViews?.[0]?.single?.value;

            if (typeof value !== "string") {
                return;
            }

            this.target.style.fontSize = `${this.formattingSettings.formatCard.fontSize.value}px`;
            this.target.style.fontFamily = this.formattingSettings.formatCard.fontFamily.value;
            this.target.style.color = this.formattingSettings.formatCard.fontColor.value.value;
            this.target.style.backgroundColor = this.formattingSettings.formatCard.backgroundColor.value.value;

            // Convert the markdown to HTML.
            const html = this.converter.makeHtml(value);

            // Set the HTML content of the target element.
            this.sanitizeAndSetHtml(html);

            // Render Mermaid diagrams if present
            await this.renderMermaidDiagrams();

            this.registerLinkHandlers();
        } catch (error) {
            console.error("Failed to update visual", error);
        } finally {
            // informs that the visual has finished rendering
            this.events.renderingFinished(options);
        }
    }

    /**
     * Sets the HTML content of the target element.
     * Passes the HTML content through the sanitizer to make sure that it does not contain any malicious content.
     * 
     * @param html The HTML content to set.
     */
    private sanitizeAndSetHtml(html: string) {
        const sanitizedHtml = DOMPurify.sanitize(html);

        // NEVER assign anything to innerHTML that did not come from the sanitizer.
        // eslint-disable-next-line powerbi-visuals/no-inner-outer-html
        this.target.innerHTML = sanitizedHtml;
    }

    /**
     * Renders Mermaid diagrams within the target element.
     */
    private async renderMermaidDiagrams(): Promise<void> {
        const mermaidBlocks = Array.from(this.target.querySelectorAll<HTMLElement>('code.language-mermaid'));

        const renderTasks = mermaidBlocks.map(async (block, index) => {
            const mermaidCode = block.textContent;

            if (mermaidCode.trim().length === 0) {
                return;
            }

            try {
                const renderResult = await mermaid.render(`mermaid-${index}`, mermaidCode);

                const mermaidDiv = document.createElement('div');

                // mermaid-js produces elements that the sanitizer does not recognize as safe,
                // but it's all SVG content, so we can safely bypass the sanitizer here.
                // eslint-disable-next-line powerbi-visuals/no-inner-outer-html
                mermaidDiv.innerHTML = renderResult.svg;

                block.replaceWith(mermaidDiv);

                // Add the mermaid-diagram class to the parent pre tag so we can center the
                // diagram and remove background color.
                mermaidDiv.parentElement.classList.add('mermaid-diagram');

                renderResult.bindFunctions?.(mermaidDiv);
            } catch (error) {
                console.error('Failed to render mermaid diagram', error);
            }
        });

        await Promise.all(renderTasks);
    }

    private registerLinkHandlers() {
        const links = Array.from(this.target.querySelectorAll<HTMLAnchorElement>('a'));

        for (const link of links) {
            link.addEventListener('click', (event) => {
                // Prevent the link from opening in the iframe.
                event.preventDefault();

                const href = link.getAttribute('href');

                if (href) {
                    // Open the link using the host.
                    this.host.launchUrl(href);
                }
            });
        }
    }

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}

/** 
 * Checks if the given value has the given flag set.
*/
function hasFlag<T extends number>(value: T, flag: T): boolean {
    return (value & flag) !== 0;
}
