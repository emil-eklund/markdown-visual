
import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel } from "./settings";
import { Converter } from "showdown";

export class Visual implements IVisual {
    private formattingSettings: VisualFormattingSettingsModel;

    private readonly target: HTMLElement;
    private readonly formattingSettingsService: FormattingSettingsService;
    private readonly converter: Converter;

    constructor(options: VisualConstructorOptions) {
        this.formattingSettingsService = new FormattingSettingsService();
        const container = document.createElement("div");
        container.classList.add("container");
        options.element.appendChild(container);
        this.target = container;
        this.converter = new Converter();
        this.converter.setFlavor("github")
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

            const html = this.converter.makeHtml(value);

            // eslint-disable-next-line powerbi-visuals/no-inner-outer-html
            this.target.innerHTML = html;
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
