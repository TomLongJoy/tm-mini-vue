"use strict";
exports.__esModule = true;
exports.generate = void 0;
function generate(ast) {
    var context = createCodegenContext();
    var push = context.push;
    push("return ");
    var code = "";
    code += "return";
    var functionName = "render";
    var args = ["_ctx", "_cache"];
    var signature = args.join(',');
    push("function " + functionName + "(" + signature + "){");
    // code += `function ${functionName}(${signature}){`
    push("return");
    // code += `return`;
    genNode(ast.codegenNode, context);
    push("}");
    // code += "}"
    return {
        code: context.code
    };
}
exports.generate = generate;
function genNode(node, context) {
    var push = context.push;
    push(" '" + node.content + "'");
    // const node = ast.codegenNode;
    // code += `rturn '${node.content}'`;
    // return code;
}
function createCodegenContext() {
    var context = {
        code: "",
        push: function (source) {
            context.code += source;
        }
    };
    return context;
}
