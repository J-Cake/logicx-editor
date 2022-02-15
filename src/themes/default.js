export const name = "default";

export default function (extension) {
    
    const colours = {
        primary: extension.util.colour(["#00bcd4", "#009688"]),
        secondary: extension.util.colour(["#f44336", "#e91e63"]),
        foreground: extension.util.colour(["#212121", "#ffffff"]),
        background: extension.util.colour(["#ffffff", "#212121"]),
        warn: extension.util.colour(["#ff9800", "#f44336"]),
        danger: extension.util.colour(["#f44336", "#e91e63"])
    };

    extension.ui.theme('default', {
        colours: colours,
        typography: {
            fontFamily: "Roboto, sans-serif",
            fontSize: "14px",
            colour: colours.foreground
        },
        borders: {
            radius: "4px",
            colour: colours.primary,
            weight: "1px",
            apply: "all"
        },
        margin: "2px"
    });
}