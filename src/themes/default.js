export const name = "default";

export default function (extension) {
    
    const colours = {
        primary: extension.util.colour(["#68B2DC", "#115c96"]),
        secondary: extension.util.colour(["#f44336", "#e91e63"]),
        foreground: extension.util.colour(["#413d3d", "#c3c3c8"]),
        background: extension.util.colour(["#FDFCF7", "#272c2d"]),
        warn: extension.util.colour(["#ff9800", "#f44336"]),
        danger: extension.util.colour(["#DB6869", "#cb3403"])
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