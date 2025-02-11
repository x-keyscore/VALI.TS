"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayFormat = void 0;
const mounter_1 = require("../../services/mounter");
const testers_1 = require("../../../testers");
exports.ArrayFormat = {
    defaultCriteria: {
        empty: true
    },
    mounting(queue, mapper, definedCriteria, mountedCriteria) {
        if ((0, mounter_1.isMountedCriteria)(definedCriteria.item)) {
            mapper.merge(mountedCriteria, definedCriteria.item, {
                pathParts: ["item"]
            });
            mountedCriteria.item = definedCriteria.item;
        }
        else {
            mapper.add(mountedCriteria, mountedCriteria.item, {
                pathParts: ["item"]
            });
            queue.push({
                definedCriteria: definedCriteria.item,
                mountedCriteria: mountedCriteria.item
            });
        }
    },
    checking(queue, criteria, value) {
        if (!(0, testers_1.isArray)(value)) {
            return ("TYPE_NOT_ARRAY");
        }
        else if (!value.length) {
            return (criteria.empty ? null : "VALUE_EMPTY");
        }
        else if (criteria.min !== undefined && value.length < criteria.min) {
            return ("VALUE_INFERIOR_MIN");
        }
        else if (criteria.max !== undefined && value.length > criteria.max) {
            return ("VALUE_SUPERIOR_MAX");
        }
        for (let i = 0; i < value.length; i++) {
            queue.push({
                criteria: criteria.item,
                value: value[i]
            });
        }
        return (null);
    }
};
