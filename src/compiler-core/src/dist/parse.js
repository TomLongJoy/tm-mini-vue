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
    if (context.source.startsWith("{{")) {
        node = parseInterpolation(context);
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
