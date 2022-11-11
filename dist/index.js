"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildReducer = void 0;
const register = ({ state, action, actionType, scenario, configs, }) => {
    var _a, _b, _c;
    if (state.scenario === scenario && action.type === actionType) {
        if (!configs[scenario] || !((_a = configs[scenario]) === null || _a === void 0 ? void 0 : _a[actionType])) {
            return state;
        }
        const config = (_b = configs[scenario]) === null || _b === void 0 ? void 0 : _b[actionType];
        if (((_c = config === null || config === void 0 ? void 0 : config.conditions) !== null && _c !== void 0 ? _c : []).some(condition => !condition(state, action))) {
            return state;
        }
        return Object.assign(Object.assign({}, state), config === null || config === void 0 ? void 0 : config.update(state, action));
    }
    return state;
};
const buildReducer = ({ configs, }) => {
    const scenarios = Object.keys(configs);
    const events = scenarios.flatMap(scenario => {
        var _a;
        const config = (_a = configs[scenario]) !== null && _a !== void 0 ? _a : {};
        const actions = Object.keys(config);
        return actions.map(action => [scenario, action]);
    });
    return (state, action) => events.reduce((prev, current) => register({
        configs,
        action,
        actionType: current[1],
        scenario: current[0],
        state: prev,
    }), state);
};
exports.buildReducer = buildReducer;
