import { NodeTypes } from "../ast";

export function transformText(node) {

    function isText(node) {
        return (
            node.type === NodeTypes.TEXT || node.type === NodeTypes.INTERPOLATION
        );
    }
    if (node.type === NodeTypes.ELEMENT) {
        const { children } = node;
        let currentContainer;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (isText(child)) {
                for (let j = i + i; j < children.length; j++) {
                    const next = children[j];
                    if (isText(next)) {
                        if (!currentContainer) {

                            currentContainer = children[i] = {
                                type: NodeTypes.COMPOUND_EXPRESSION,
                                children: [child]
                            }
                        }

                        currentContainer.children.push(" + ")
                        currentContainer.children.push(next);
                        children.splice(j, 1);//删除
                        j--;
                    } else {

                        currentContainer = undefined;
                        break;
                    }
                }
            }

        }
    }
}