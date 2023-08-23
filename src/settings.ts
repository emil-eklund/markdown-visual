import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

class FormatCardSettings extends FormattingSettingsCard {

    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Text Size",
        value: 12
    });

    fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Text Color",
        value: { value: "#000000" },
        defaultColor: { value: "#000000" },
        isNoFillItemSupported: false
    });

    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Background Color",
        defaultColor: { value: "#ffffff" },
        value: { value: "#ffffff" },
        isNoFillItemSupported: true
    });

    fontFamily = new formattingSettings.FontPicker({
        value: "Arial",
        name: "fontFamily",
        displayName: "Font Family"
    });

    name: string = "formatting";
    displayName: string = "Format";
    slices: Array<FormattingSettingsSlice> = [
        this.fontSize,
        this.fontFamily,
        this.fontColor,
        this.backgroundColor
    ];
}

/**
* visual settings model class
*
*/
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    formatCard = new FormatCardSettings();

    cards = [this.formatCard];
}
