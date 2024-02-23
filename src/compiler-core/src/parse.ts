import { NodeTypes } from "./ast";

const enum TagType {
    Start,
    End,
}

export function baseParse(content: string) {

    const context = createParseContent(content);
    return createRoot(parseChildren(context, []))

}

function parseChildren(context, ancestors) {
    const nodes: any = [];

    while (!isEnd(context, ancestors)) {
        let node;
        const s = context.source;
        if (s.startsWith("{{")) {
            node = parseInterpolation(context)
        } else if (s[0] === '<') {
            if (/[a-z]/i.test(s[1])) {
                node = parseElement(context, ancestors);
            }
        }
        if (!node) {
            node = parseText(context);
        }

        nodes.push(node);
    }

    return nodes;
}
function isEnd(context, ancestors) {
    const s = context.source;
    if (s.startsWith("</")) {
        for (let i = 0; i < ancestors.length; i++) {
            const tag = ancestors[i].tag;
            if (startWithEndTagOpen(s, tag)) {

                return true
            }

        }
    }
    //2.当遇到结束标签的时候
    // if (parentTag && s.startsWith(`</${parentTag}>`)) {
    //     return true;
    // }

    //1.source 有值的时候

    return !context.source;
}

function parseInterpolation(context) {
    // {{message}}
    const openDelimiter = "{{"
    const closeDelimiter = "}}";

    const clsoeIndex = context.source.indexOf("}}", openDelimiter.length);

    advanceBy(context, openDelimiter.length);

    const rawContentLength = clsoeIndex - openDelimiter.length;
    const rawContent = parseTextData(context, rawContentLength);// context.source.slice(0, rawContentLength);
    const content = rawContent.trim();

    advanceBy(context, closeDelimiter.length)


    return {
        type: NodeTypes.INTERPOLATION, // "interpolation",
        content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: content,
        }
    }
}

function advanceBy(context: any, length: number) {
    context.source = context.source.slice(length);
}

function createRoot(children) {
    return {
        children,
        type: NodeTypes.ROOT,
        helpers: [],
    }
}

function createParseContent(content: string): any {
    return {
        source: content
    }
}
function parseElement(context: any, ancestors) {
    //Implement
    // 1.解析tag
    const element: any = parseTag(context, TagType.Start);
    ancestors.push(element);
    element.children = parseChildren(context, ancestors);
    ancestors.pop();

    if (startWithEndTagOpen(context.source, element.tag)) {

        parseTag(context, TagType.End);
    } else {
        throw new Error(`缺少结束标签：${element.tag}`)
    }

    return element;
}

function startWithEndTagOpen(source, tag) {
    return source.startsWith("</") && source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase();
}

function parseTag(context: any, type: TagType) {
    const match: any = /^<\/?([a-z]*)/i.exec(context.source);
    // console.log(match);
    const tag = match[1];

    //2.删除处理完成的代码
    advanceBy(context, match[0].length);
    advanceBy(context, 1);
    // console.log(context);

    if (type === TagType.End) return;

    return {
        type: NodeTypes.ELEMENT,
        tag,
    };
}

function parseText(context: any): any {
    let endIndex = context.source.length;
    let endTokens = ["<", "{{"]
    for (let i = 0; i < endTokens.length; i++) {

        const index = context.source.indexOf(endTokens[i]);
        if (index !== -1 && endIndex > index) {
            endIndex = index;
        }
    }


    //1. 获取content
    const content = parseTextData(context, endIndex);
    // console.log("content-------------", content);

    // console.log(context.source);

    return {
        type: NodeTypes.TEXT,
        content
    }
}

function parseTextData(context: any, length) {
    const content = context.source.slice(0, length);
    //2.推进
    advanceBy(context, length);
    return content;
}

