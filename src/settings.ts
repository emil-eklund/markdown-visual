import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

class FormatCardSettings extends FormattingSettingsCard {

    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Text Size",
        displayNameKey: "F_FontSize",
        value: 14
    });

    fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Text Color",
        displayNameKey: "F_FontColor",
        value: { value: "#1F2328" },
        defaultColor: { value: "#1F2328" },
        isNoFillItemSupported: false
    });

    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Background Color",
        displayNameKey: "F_BackgroundColor",
        defaultColor: { value: "#ffffff" },
        value: { value: "#ffffff" },
        isNoFillItemSupported: true
    });

    fontFamily = new formattingSettings.FontPicker({
        value: "Segoe UI",
        name: "fontFamily",
        displayName: "Font Family",
        displayNameKey: "F_FontFamily"
    });

    name: string = "formatting";
    displayName: string = "Format";
    displayNameKey: string = "F_Formatting";
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
