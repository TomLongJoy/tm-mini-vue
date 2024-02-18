"use strict";
exports.__esModule = true;
exports.baseParse = void 0;
function baseParse(content) {
    var context = createParserContext(content);
    return createRoot(parseChildren(context, []));
}
exports.baseParse = baseParse;
function parseChildren(context, ancestors) {
    var nodes = [];
    while (!isEnd(context, ancestors)) {
        var node = void 0;
        var s = context.source;
        if (s.startsWith("{{")) {
            node = parseInterpolation(context);
        }
        else if (s[0] === "<") {
            if (/[a-z]/i.test(s[1])) {
                // console.log("parse element ");
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
    var s = context.source;
    //2.当遇到结束标签的时候
    if (s.startsWith("</")) {
        for (var i = ancestors.length - 1; i >= 0; i--) {
            var tag = ancestors[i].tag;
            if (startsWithEndTagOpen(s, tag)) {
                return true;
            }
        }
    }
    // if (parentTag && s.startsWith(`</${parentTag}>`)) {
    //     return true;
    // }
    //1.souce 有值的时候
    return !s;
}
function parseInterpolation(context) {
    // {{message}}
    var openDelimiter = "{{";
    var closeDelimiter = "}}";
    var closeIndex = context.source.indexOf("}}", openDelimiter.length);
    advaceBy(context, openDelimiter.length);
    var rawContentLength = closeIndex - openDelimiter.length;
    var rawContent = parseTextData(context, rawContentLength); //context.source.slice(0, rawContentLength);
    var content = rawContent.trim();
    advaceBy(context, closeDelimiter.length);
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
function parseElement(context, ancestors) {
    // Implement 
    //1. 解析 tag
    var element = parseTag(context, 0 /* Start */);
    ancestors.push(element);
    element.children = parseChildren(context, ancestors);
    ancestors.pop();
    console.log("---------------");
    console.log(element.tag);
    console.log(context.source);
    if (startsWithEndTagOpen(context.source, element.tag)) {
        parseTag(context, 1 /* End */);
    }
    else {
        throw new Error("\u7F3A\u5C11\u7ED3\u675F\u6807\u7B7E:" + element.tag);
    }
    console.log("------------------", context.source);
    return element;
}
function startsWithEndTagOpen(source, tag) {
    return source.startsWith("</") && source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase();
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
    var endIndex = context.source.length;
    var endTokens = ["<", "{{"];
    for (var i = 0; i < endTokens.length; i++) {
        var index = context.source.indexOf(endTokens[i]);
        if (index !== -1 && endIndex > index) {
            endIndex = index;
        }
    }
    var content = parseTextData(context, endIndex);
    return {
        type: 3 /* TEXT */,
        content: content
    };
}
function parseTextData(context, length) {
    //1.获取content
    var content = context.source.slice(0, length);
    //2. 推进
    advaceBy(context, length);
    return content;
}
