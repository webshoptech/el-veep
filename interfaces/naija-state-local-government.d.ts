declare module 'naija-state-local-government' {
  interface LgaResult {
    state: string;
    lgas: string[];
  }

  const naijaStateLocalGov: {
    states: () => string[];
    lgas: (state: string) => LgaResult;
  };

  export default naijaStateLocalGov;
}
