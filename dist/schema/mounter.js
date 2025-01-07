"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaMounter = schemaMounter;
const formats_1 = require("../formats");
function processTask(task) {
    const format = formats_1.formatsInstances[task.definedCriteria.type];
    if (!format)
        throw new Error("Unknown format type");
    format.mountCriteria(task.definedCriteria, task.mountedCriteria);
    const mountTasks = format.getMountingTasks(task.definedCriteria, task.mountedCriteria);
    return (mountTasks);
}
function schemaMounter(definedCriteria) {
    let mountedCriteria = {};
    let queue = [{ definedCriteria, mountedCriteria }];
    while (queue.length > 0) {
        const currentTask = queue.pop();
        const mountTasks = processTask(currentTask);
        queue.push(...mountTasks);
    }
    return (mountedCriteria);
}
;
