"use strict";
exports.__esModule = true;
exports.generate = void 0;
var runtimeHelpers_1 = require("./runtimeHelpers");
function generate(ast) {
    var context = createCodegenContext();
    var push = context.push;
    genFunctionPreamble(ast, context);
    var code = "";
    code += "return";
    var functionName = "render";
    var args = ["_ctx", "_cache"];
    var signature = args.join(',');
    push("function " + functionName + "(" + signature + "){");
    // code += `function ${functionName}(${signature}){`
    push("return ");
    // code += `return`;
    genNode(ast.codegenNode, context);
    push("}");
    // code += "}"
    return {
        code: context.code
    };
}
exports.generate = generate;
function genFunctionPreamble(ast, context) {
    var push = context.push;
    var VueBinging = "Vue";
    var aliasHelper = function (s) { return runtimeHelpers_1.helperMapName[s] + ":_" + runtimeHelpers_1.helperMapName[s]; };
    if (ast.helpers.length > 0) {
        push("const { " + ast.helpers.map(aliasHelper).join(', ') + " } = " + VueBinging);
    }
    push('\n');
    push("return ");
}
function genNode(node, context) {
    switch (node.type) {
        case 3 /* TEXT */:
            genText(node, context);
            break;
        case 0 /* INTERPOLATION */:
            genInterpolation(node, context);
            break;
        case 1 /* SIMPLE_EXPRESSION */:
            genExpression(node, context);
            break;
        default:
            break;
    }
}
function genText(node, context) {
    var push = context.push;
    push(" '" + node.content + "'");
}
function genInterpolation(node, context) {
    var push = context.push, helper = context.helper;
    // console.log(node)
    push(helper(runtimeHelpers_1.TO_DISPLAY_STRING) + "(");
    genNode(node.content, context);
    push(")");
}
function createCodegenContext() {
    var context = {
        code: "",
        push: function (source) {
            context.code += source;
        },
        helper: function (key) {
            return "_" + runtimeHelpers_1.helperMapName[key];
        }
    };
    return context;
}
function genExpression(node, context) {
    var push = context.push;
    push("" + node.content);
}
