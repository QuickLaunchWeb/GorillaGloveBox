// Import React types to fix React module errors
/// <reference path="./react.d.ts" />
/// <reference path="./mui.d.ts" />
/// <reference path="./js-yaml.d.ts" />

// Global utility type for theme parameter usage
declare interface Theme {
  zIndex: {
    drawer: number;
    [key: string]: any;
  };
  transitions: {
    create: (props: string | string[], options?: any) => string;
    easing: {
      sharp: string;
      easeOut: string;
      easeIn: string;
      easeInOut: string;
    };
    duration: {
      shortest: number;
      shorter: number;
      short: number;
      standard: number;
      complex: number;
      enteringScreen: number;
      leavingScreen: number;
    };
  };
}
