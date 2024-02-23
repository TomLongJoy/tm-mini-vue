import { NodeTypes, createVNodeCall } from "../ast";

export function transformElement(node: any, context: any) {

    if (node.type === NodeTypes.ELEMENT) {
        return () => {
            //tag 
            const vnodeTag = `'${node.tag}'`;

            // props 
            let vnodeprops;
            const children = node.children;
            let vnodeChildren = children[0];
            node.codegenNode = createVNodeCall(context, vnodeTag, vnodeprops, vnodeChildren);
        }

    }
}