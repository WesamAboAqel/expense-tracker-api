import colors from "colors";
colors.enable();

export const formatDateTime = (date = new Date()): string => {
    return `[${date.toISOString().replace("T", " ").split(".")[0]}]`["magenta"];
};
