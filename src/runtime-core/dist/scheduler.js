"use strict";
exports.__esModule = true;
exports.queueJobs = exports.nextTick = void 0;
var queue = [];
var p = Promise.resolve();
var isFlushPending = false;
function nextTick(fn) {
    return fn ? p.then(fn) : p;
}
exports.nextTick = nextTick;
function queueJobs(job) {
    if (!queue.includes(job)) {
        queue.push(job);
    }
    queueFlush();
}
exports.queueJobs = queueJobs;
function queueFlush() {
    if (isFlushPending)
        return;
    isFlushPending = true;
    nextTick(flushJobs);
}
function flushJobs() {
    isFlushPending = false;
    var job;
    // 取出头部
    while (job = queue.shift()) {
        job && job();
    }
}
