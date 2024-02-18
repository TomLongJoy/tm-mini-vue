import { NodeTypes } from "./ast";

const enum TagType {
    Start,
    End
}

export function baseParse(content: string) {

    const context = createParserContext(content);
    return createRoot(parseChildren(context));
}

function parseChildren(context) {

    const nodes: any = [];

    let node;
    const s = context.source;
    if (s.startsWith("{{")) {
        node = parseInterpolation(context);
    } else if (s[0] === "<") {
        if (/[a-z]/i.test(s[1])) {
            console.log("parse element ");
            node = parseElement(context);
        }
    }

    if (!node) {
        node = parseText(context);
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


    const rawContent = parseTextData(context, rawContentLength);  //context.source.slice(0, rawContentLength);
    const content = rawContent.trim();

    advaceBy(context, closeDelimiter.length);
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

function parseElement(context: any) {
    // Implement 
    //1. 解析 tag
    const element = parseTag(context, TagType.Start);
    parseTag(context, TagType.End);
    console.log("------------------", context.source)
    return element;
}
function parseTag(context: any, type: TagType) {
    const match: any = /^<\/?([a-z]*)/i.exec(context.source);
    console.log(match);
    const tag = match[1];
    //2. 删除处理完成的代码
    advaceBy(context, match[0].length);

    advaceBy(context, 1);
    if (type === TagType.End) return;

    return {
        type: NodeTypes.ELEMENT,
        tag
    };
}

function parseText(context: any): any {

    const content = parseTextData(context, context.source.length);
    return {
        type: NodeTypes.TEXT,
        content
    }
}

function parseTextData(context: any, length: number) {
    //1.获取content
    const content = context.source.slice(0, length);
    //2. 推进
    advaceBy(context, length);
    return content;
}

