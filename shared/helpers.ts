// Mainly used to check for exhaustiveness
export const assertUnreachable = (x: never): never => {
    throw new Error("Didn't expect to get here");
};
