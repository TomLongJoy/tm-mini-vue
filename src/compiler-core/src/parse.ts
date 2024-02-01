import { NodeTypes } from "./ast";

export function baseParse(content: string) {

    const context = createParserContext(content);
    return createRoot(parseChildren(context));
}

function parseChildren(context) {

    const nodes: any = [];

    let node;
    if (context.source.startsWith("{{")) {
        node = parseInterpolation(context);

    }
    nodes.push(node);
    return nodes;
}

function parseInterpolation(context) {

    // {{message}}
    const openDelimiter = "{{"
    const closeDelimiter = "}}"

    const closeIndex = context.source.indexOf("}}", openDelimiter.length);
    advaceBy(context, openDelimiter.length);
    const rawContentLength = closeIndex - openDelimiter.length;
    const rawContent = context.source.slice(0, rawContentLength);
    const content = rawContent.trim();

    advaceBy(context, rawContentLength + closeDelimiter.length);
    // context.source = context.source.slice(rawContentLength + closeDelimiter.length);


    return {
        type: NodeTypes.INTERPOLATION,
        content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: content,
        }
    }
}

function advaceBy(context: any, length: number) {
    context.source = context.source.slice(length);
}

function createRoot(children: any) {
    return {
        children,
    }
}

function createParserContext(content: string): any {
    return {
        source: content
    }
}