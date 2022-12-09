export const name = "default";

export default function (extension) {
    const colours = {
        primary: extension.util.parseColour(["#7dbae8", "#115c96"]),
        secondary: extension.util.parseColour(["#9bcfff", "#379bd1"]),
        accent: extension.util.parseColour(["#f44336", "#e91e63"]),
        foreground: extension.util.parseColour(["#524e4e", "#c3c3c8"]),
        background: extension.util.parseColour(["#eaeaef", "#272c2d"]),
        warn: extension.util.parseColour(["#ff9800", "#f44336"]),
        danger: extension.util.parseColour(["#DB6869", "#cb3403"])
    };

    extension.ui.theme('default', {
        colours: colours,
        typography: {
            fontFamily: "Raleway, sans-serif",
            fontSize: "12px",
            colour: colours.foreground
        },
        borders: {
            radius: "1px",
            colour: colours.secondary,
            weight: "1px",
            apply: "bottom"
        },
        padding: "4px 12px",
        stylesheet: [theme => `
            .logicx-widgets.splitter {
                width: 3px;
                border-color: ${extension.util.switchColour(theme.colours.foreground).stringify(false)} !important;
            }`]
    });

    extension.ui.keymap('default', {
        'shift+a': 'add-menu.add'
    });
}