import { NodeTypes } from "./ast";

export function isText(node: any) {
    return (node.type === NodeTypes.TEXT || NodeTypes.INTERPOLATION);
} 