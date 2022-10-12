export enum CommandTypeEnum {
    None = -1,
    Alert, // payload: {type: "error" | "info" | "success", message: text}
}
