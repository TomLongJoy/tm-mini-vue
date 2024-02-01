"use strict";
exports.__esModule = true;
exports.baseParse = void 0;
function baseParse(content) {
    var context = createParserContext(content);
    return createRoot(parseChildren(context));
}
exports.baseParse = baseParse;
function parseChildren(context) {
    var nodes = [];
    var node;
    var s = context.source;
    if (s.startsWith("{{")) {
        node = parseInterpolation(context);
    }
    else if (s[0] === "<") {
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
    var openDelimiter = "{{";
    var closeDelimiter = "}}";
    var closeIndex = context.source.indexOf("}}", openDelimiter.length);
    advaceBy(context, openDelimiter.length);
    var rawContentLength = closeIndex - openDelimiter.length;
    var rawContent = context.source.slice(0, rawContentLength);
    var content = rawContent.trim();
    advaceBy(context, rawContentLength + closeDelimiter.length);
    // context.source = context.source.slice(rawContentLength + closeDelimiter.length);
    return {
        type: 0 /* INTERPOLATION */,
        content: {
            type: 1 /* SIMPLE_EXPRESSION */,
            content: content
        }
    };
}
function advaceBy(context, length) {
    context.source = context.source.slice(length);
}
function createRoot(children) {
    return {
        children: children
    };
}
function createParserContext(content) {
    return {
        source: content
    };
}
function parseElement(context) {
    // Implement 
    //1. 解析 tag
    var element = parseTag(context, 0 /* Start */);
    parseTag(context, 1 /* End */);
    console.log("------------------", context.source);
    return element;
}
function parseTag(context, type) {
    var match = /^<\/?([a-z]*)/i.exec(context.source);
    console.log(match);
    var tag = match[1];
    //2. 删除处理完成的代码
    advaceBy(context, match[0].length);
    advaceBy(context, 1);
    if (type === 1 /* End */)
        return;
    return {
        type: 2 /* ELEMENT */,
        tag: tag
    };
}
function parseText(context) {
    //1.获取content
    //2. 推进
    return {
        type: 3 /* TEXT */,
        context: "some text"
    };
}
