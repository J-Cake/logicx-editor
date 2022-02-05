extension("Default", function (extension) {
    extension.registerTheme('default', {
        colours: {
            primary: ["#00bcd4", "#009688"],
            secondary: ["#f44336", "#e91e63"],
            foreground: ["#212121", "#ffffff"],
            background: ["#ffffff", "#212121"],
            warn: ["#ff9800", "#f44336"],
            danger: ["#f44336", "#e91e63"]
        },
        typography: {
            fontFamily: "Roboto, sans-serif",
            fontSize: "14px",
            colour: "foreground"
        },
        borders: {
            radius: "4px",
            colour: "primary",
            weight: "1px",
            apply: "all"
        },
        margin: "2px"
    });
});