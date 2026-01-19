declare module 'minimatch' {
  function minimatch(target: string, pattern: string, options?: any): boolean;
  namespace minimatch {
    function match(list: string[], pattern: string, options?: any): string[];
    function filter(pattern: string, options?: any): (element: string) => boolean;
    function makeRe(pattern: string, options?: any): RegExp;
    var Minimatch: any;
  }
  export = minimatch;
}
