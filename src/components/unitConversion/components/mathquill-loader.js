import jQuery from 'jquery';

// TODO check if it not exist already
global.window.jQuery = jQuery;

export default null;

// const MathQuillLoader = () => {
//   let instance;
//
//   const createInstance = () => {
//     return import('@edtr-io/mathquill/build/mathquill.js');
//   };
//
//   const get = () => {
//     if (!instance) {
//       return createInstance();
//     } else {
//       return new Promise(function(resolve, reject) {
//         resolve(instance);
//       });
//     }
//   };
//
//   return get();
// };
//
// export default MathQuillLoader;
