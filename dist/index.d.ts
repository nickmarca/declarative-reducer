declare type State = {
    scenario: string;
};
declare type Action = {
    type: string;
};
declare type FindByType<Union, TypeName> = Union extends {
    type: TypeName;
} ? Union : never;
declare type Config<S extends State, A extends Action, K extends A['type']> = {
    update: (state: S, action: FindByType<A, K>) => Partial<S>;
    conditions?: ((state: S, action: FindByType<A, K>) => boolean)[];
};
export declare type Configs<S extends State, A extends Action> = {
    [T in S['scenario']]?: {
        [K in A['type']]?: Config<S, A, K>;
    };
};
declare type RegisterParams<S extends State, A extends Action> = {
    configs: Configs<S, A>;
    state: S;
    action: A;
    scenario: S['scenario'];
    actionType: A['type'];
};
export declare const buildReducer: <S extends State, A extends Action>({ configs, }: RegisterParams<S, A>) => (state: S, action: A) => S;
export {};
//# sourceMappingURL=index.d.ts.map