type State = {
  scenario: string;
};

type Action = {
  type: string;
};

type FindByType<Union, TypeName> = Union extends { type: TypeName }
  ? Union
  : never;

type Config<S extends State, A extends Action, K extends A['type']> = {
  update: (state: S, action: FindByType<A, K>) => Partial<S>;
  conditions?: ((state: S, action: FindByType<A, K>) => boolean)[];
};

export type Configs<S extends State, A extends Action> = {
  [T in S['scenario']]?: {
    [K in A['type']]?: Config<S, A, K>;
  };
};

type RegisterParams<S extends State, A extends Action> = {
  configs: Configs<S, A>;
  state: S;
  action: A;
  scenario: S['scenario'];
  actionType: A['type'];
};

const register = <S extends State, A extends Action>({
  state,
  action,
  actionType,
  scenario,
  configs,
}: RegisterParams<S, A>): S => {
  if (state.scenario === scenario && action.type === actionType) {
    if (!configs[scenario] || !configs[scenario]?.[actionType]) {
      return state;
    }

    const config = configs[scenario]?.[actionType];

    if (
      (config?.conditions ?? []).some(
        condition => !condition(state, action as FindByType<A, A['type']>),
      )
    ) {
      return state;
    }

    return {
      ...state,
      ...config?.update(state, action as FindByType<A, A['type']>),
    };
  }
  return state;
};

export const buildReducer = <S extends State, A extends Action>({
  configs,
}: RegisterParams<S, A>): ((state: S, action: A) => S) => {
  const scenarios = Object.keys(configs) as S['scenario'][];
  const events = scenarios.flatMap(scenario => {
    const config = configs[scenario] ?? {};
    const actions = Object.keys(config) as A['type'][];
    return actions.map(action => [scenario, action] as const);
  });

  return (state, action) =>
    events.reduce(
      (prev, current) =>
        register<S, A>({
          configs,
          action,
          actionType: current[1],
          scenario: current[0],
          state: prev,
        }),
      state,
    );
};
