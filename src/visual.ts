import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel } from "./settings";
import { Converter } from "showdown";
import * as DOMPurify from 'dompurify';

export class Visual implements IVisual {
    private formattingSettings: VisualFormattingSettingsModel;

    private readonly target: HTMLElement;
    private readonly formattingSettingsService: FormattingSettingsService;
    private readonly converter: Converter;
    private readonly host: powerbi.extensibility.visual.IVisualHost;

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.formattingSettingsService = new FormattingSettingsService();
        const container = document.createElement("div");
        container.classList.add("container", "github");
        options.element.appendChild(container);
        this.target = container;
        this.converter = new Converter();
        this.converter.setFlavor("github");
    }

    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews);

        if (hasFlag(options.type, powerbi.VisualUpdateType.Data)) {
            const value = options.dataViews[0].single.value;

            if (typeof value !== 'string') {
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

            // Power BI does not allow visuals to open links directly.
            // We need to use the host to open links.
            const links = this.target.querySelectorAll("a");

            for (const link of Array.from(links)) {
                link.addEventListener("click", (event) => {
                    // Prevent the link from opening in the iframe.
                    event.preventDefault();

                    // Open the link using the host.
                    this.host.launchUrl(link.getAttribute("href"));
                });
            }
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
