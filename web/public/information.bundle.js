/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/scss/information.scss":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/scss/information.scss ***!
  \****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ \"./node_modules/css-loader/dist/runtime/noSourceMaps.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);\n// Imports\n\n\nvar ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, `@charset \"UTF-8\";\n* {\n  margin: 0;\n  padding: 0;\n  letter-spacing: 1px;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 0;\n  /* box-sizing: border-box; */\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  /* 靠上對齊 */\n  height: 50vh;\n  /* 背景顏色 */\n  background-color: #f6f7fb;\n}\n\n/*---------------------------最上排選擇欄位and滑鼠觸碰事件-------------------------------*/\n#menu {\n  z-index: 122;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 80px;\n  position: fixed;\n  background-color: rgba(34, 34, 34, 0.682);\n  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.7490196078);\n  /*左右,上下陰影位置,陰影模糊度*/\n  padding-left: 3%;\n  padding-right: 34%;\n  transition: 0.2s;\n}\n#menu img {\n  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.7490196078);\n  /*左右,上下陰影位置,陰影模糊度*/\n  background-color: rgba(144, 144, 144, 0.7058823529);\n  padding-bottom: 30px;\n  margin: -15px 100px 0px 100px;\n  transition: 0.2s;\n}\n#menu .header {\n  font-weight: bold;\n  position: absolute;\n  display: inline-block;\n  list-style: none;\n  /*列表樣式為空*/\n  transition: 0.2s;\n}\n#menu .header .list {\n  width: 100px;\n  height: 60px;\n  text-align: center;\n  /* 水平置中 */\n  float: left;\n  padding: 10px;\n  margin: 20px 20px 20px 20px;\n  /*上右下左邊距 */\n  transition: 0.2s;\n}\n#menu .header .list:hover {\n  transition: 0.2s;\n  height: 50px;\n  text-shadow: 0 0 10px #69e0ff, 0 0 20px #69e0ff, 0 0 10px #69e0ff;\n  background: linear-gradient(to top, #8d8c8c 20%, transparent 100%);\n  /*background往上顯示顏色還有逐漸變透明位置和比例*/\n  transform: translatey(-3px);\n  font-size: 110%;\n}\n#menu:hover {\n  height: 90px;\n  background-color: rgb(73, 73, 73);\n  transition: 0.4s;\n}\n#menu:hover img {\n  background-color: #909090;\n  transition: 0.4s;\n  transform: translateY(8px);\n}\n#menu:hover .header {\n  transition: 0.4s;\n  transform: translateY(8px);\n}\n\n/*---------------------------登入下拉式表-------------------*/\n.header__login {\n  display: flex;\n  justify-content: flex-end;\n  /*將子項目在主軸上對齊到容器的末端*/\n  position: absolute;\n  top: 0;\n  right: 50px;\n  height: 100%;\n  white-space: nowrap;\n  /*禁止文本換行，文本將在同一行內繼續排列，直到遇到 <br> 標籤或容器寬度不夠顯示整行文本為止。*/\n  font-size: 14px;\n  transition: all 0.2s;\n  /*-----------------------單純只有下拉表會員名稱的觸碰效果------------*/\n  /*--------------下拉清單------------------------------------------*/\n}\n.header__login:hover {\n  transition: 0.2s;\n}\n.header__login:hover .login__dropdown--menu {\n  display: block;\n  transition: 0.2s;\n}\n.header__login .login__dropdown {\n  position: relative;\n  padding: 0 30px 0 0;\n  height: 100%;\n  background: transparent;\n  /*背景完全透明*/\n  outline: none;\n  border: 0;\n  font-size: inherit;\n  color: #fff9f9;\n  cursor: pointer;\n  /*鼠標碰到變點擊*/\n  transition: 0.2s;\n  /*這種是單純裝飾用，after是跟在後面，before是跟在前面。\n  這裡是下拉欄後面的倒三角形*/\n}\n.header__login .login__dropdown:hover {\n  height: 90px;\n  text-shadow: 0 0 10px #69e0ff, 0 0 20px #69e0ff, 0 0 10px #69e0ff;\n  transition: 0.2s;\n}\n.header__login .login__dropdown ::after {\n  content: \"\";\n  position: absolute;\n  right: 0%;\n  top: 50%;\n  width: 0;\n  height: 0;\n  /*倒三角形*/\n  border-bottom: 6px solid rgba(255, 255, 255, 0.8431372549);\n  border-left: 6px solid transparent;\n  /*透明度*/\n  border-right: 6px solid transparent;\n  transform: rotate(-180deg);\n  transition: 0.4s;\n}\n.header__login .login__dropdown--menu {\n  background-color: rgba(34, 34, 34, 0.904);\n  box-shadow: 5px 5px 3px rgba(0, 0, 0, 0.7490196078);\n  /*左右,上下陰影位置,陰影模糊度*/\n  font-weight: bold;\n  position: absolute;\n  display: none;\n  list-style: none;\n  /*列表樣式為空*/\n  transition: 0.4s;\n  margin-top: 80px;\n}\n.header__login .login__dropdown--menu .dropdown {\n  text-align: center;\n  /* 水平置中 */\n  padding: 10px;\n  margin: 20px 20px 20px 20px;\n  /*上右左下邊距 */\n  transition: 0.4s;\n  right: 6px;\n}\n.header__login .login__dropdown--menu .dropdown:hover {\n  text-shadow: 0 0 10px #69e0ff, 0 0 20px #69e0ff, 0 0 10px #69e0ff;\n  transition: 0.4s;\n  right: 2px;\n  display: block;\n  transform: rotatez(\"-3px\");\n  background: linear-gradient(to left, #8d8c8c 50%, transparent 100%);\n  /*background往上顯示顏色還有逐漸變透明位置和比例*/\n}\n\n/*---上排連結文字----*/\na {\n  text-decoration: none;\n  color: #151414;\n}\n\n#home-link {\n  color: #ffffff;\n  /* 藍色 */\n}\n\n#info-link {\n  color: #ffffff;\n  /* 橙色 */\n}\n\n#function-li {\n  color: #ffffff;\n  /* 綠色 */\n}\n\n#delete {\n  color: #ffffff;\n}\n\n#logout {\n  color: #ffffff;\n}\n\n/*---------------------------卡片建立介面-------------------------------*/\n.form {\n  z-index: 2;\n  background-color: #f6f7fb;\n  position: fixed;\n  width: 100%;\n  padding-top: 80px;\n}\n.form .form-container {\n  border-radius: 10px;\n  display: flex;\n  justify-content: center;\n  flex-direction: row;\n  gap: 50px;\n  flex-wrap: wrap;\n  width: 100%;\n}\n.form .form-container .button-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.form .form-container .button-container .btn {\n  margin-right: 10px;\n  border-color: #9196a1;\n  margin-top: 10px;\n  margin-bottom: 10px;\n  font-weight: 600;\n  color: #586380;\n  width: 100px;\n  height: 40px;\n  background-color: #ffffff;\n  border-radius: 5px;\n  transition: 0.2s;\n}\n.form .form-container .button-container .btn:hover {\n  background-color: #c6dbfe;\n  transition: 0.2s;\n}\n.form .form-container h2 {\n  font-size: 36px;\n  text-align: center;\n  color: #586380;\n  padding: 30px 30px;\n  letter-spacing: 0.1em;\n}\n.form .form-container #card-form {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: start;\n  margin-bottom: 5px;\n}\n.form .form-container #card-form label {\n  margin-bottom: 5px;\n  font-weight: 600;\n  font-size: 15px;\n  color: #586380;\n}\n.form .form-container #card-form input {\n  border: none;\n  border-bottom: 3px solid #000;\n  padding: 10px 10px;\n  height: 40px;\n  margin-bottom: 10px;\n  width: 400px;\n  font-size: 14px;\n  /* 邊框顏色過度效果 */\n  outline: none;\n  background-color: #f6f7fb;\n  transition: 0.1s;\n}\n.form .form-container #card-form input:hover {\n  /* 邊框顏色過度效果 */\n  background-color: #d3e3fd;\n  transition: 0.1s;\n}\n.form .form-container #card-form input:focus {\n  border-bottom: 4px solid #3992ff;\n  /* 輸入框聚焦石的顏色 */\n  /* 邊框顏色過度效果 */\n  background-color: #f6f7fb;\n  transition: 0.1s;\n}\n\n/*---------------------------卡片內容-------------------------------*/\n.cardcontent {\n  position: absolute;\n  top: 350px;\n  max-width: 81.25em;\n  padding: 0 2.5rem;\n}\n.cardcontent .contair {\n  margin-top: 50px;\n  width: 100%;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  align-items: center;\n}\n.cardcontent .contair .contantbox {\n  display: inline-block;\n  position: relative;\n  width: 350px;\n  height: 200px;\n  margin: 20px;\n  border-radius: 10px;\n  padding: 20px;\n  text-align: center;\n  cursor: pointer;\n  transition: 0.2s;\n  background-color: rgb(255, 255, 255);\n}\n.cardcontent .contair .contantbox:hover {\n  transform: scale(1.02);\n  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);\n  transition: 0.2s;\n}\n.cardcontent .contair .contantbox button {\n  color: #586380;\n  padding: 0.5rem;\n  border-radius: 0.5rem;\n  border: none;\n  height: 2.5rem;\n  transition: 0.2s;\n  margin-top: 3.5rem;\n  background-color: #ffffff;\n  cursor: pointer;\n}\n.cardcontent .contair .contantbox button:hover {\n  background-color: #c6dbfe;\n  transition: 0.2s;\n}\n\n/*-------------------Dialog-------------------------*/\ndialog {\n  border: none;\n  box-shadow: 2px 2px 10px 0px rgb(98, 98, 98);\n  border-radius: 20px;\n  padding: 50px;\n  background-color: rgb(255, 255, 255);\n  text-align: center;\n  width: 400px;\n  position: fixed;\n  /* 或 absolute，取決於需求 */\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\ndialog a {\n  color: #151414;\n  font-family: impact;\n  font-size: 5em;\n}\ndialog img {\n  width: 100%;\n}\ndialog #close {\n  border: none;\n  border-radius: 20px;\n  cursor: pointer;\n  box-shadow: 2px 2px 2px 0px rgb(98, 98, 98);\n  background-color: rgb(231, 227, 227);\n  transition: 0.2s;\n  position: absolute;\n  width: 30px;\n  height: 30px;\n  top: 10px;\n  right: 10px;\n}\ndialog #close:hover {\n  transition: 0.2s;\n  background-color: rgba(192, 191, 191, 0.9);\n  transition: 0.2s;\n}\ndialog #button1 {\n  color: white;\n  border: none;\n  border-radius: 30%;\n  cursor: pointer;\n  background-color: rgba(175, 56, 56, 0);\n  transition: 0.2s;\n  width: 80px;\n  height: 80px;\n  margin: 20px 20px;\n}\ndialog #button1:hover {\n  background-color: rgba(186, 186, 186, 0.616);\n  transition: 0.2s;\n}\n\n/*--------------------------------------------------------------------------*/\n.loading_wrapper {\n  background-color: rgba(131, 131, 131, 0.5725490196);\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  position: fixed;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 10009;\n}\n.loading_wrapper .title__div {\n  height: 60%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n.loading_wrapper .title__div .title {\n  color: rgb(255, 255, 255);\n  font-weight: bold;\n  font-size: 5rem;\n}\n\n.spinner {\n  animation: rotator 1.4s linear infinite;\n  padding: 60px;\n  z-index: 10009;\n}\n\n@keyframes rotator {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(270deg);\n  }\n}\n.path {\n  stroke-dasharray: 187;\n  stroke-dashoffset: 0;\n  transform-origin: center;\n  animation: dash 1.4s ease-in-out infinite, colors 5.6s ease-in-out infinite;\n}\n\n@keyframes colors {\n  0% {\n    stroke: #4285F4;\n  }\n  25% {\n    stroke: #DE3E35;\n  }\n  50% {\n    stroke: #F7C223;\n  }\n  75% {\n    stroke: #1B9A59;\n  }\n  100% {\n    stroke: #4285F4;\n  }\n}\n@keyframes dash {\n  0% {\n    stroke-dashoffset: 187;\n  }\n  50% {\n    stroke-dashoffset: 46.75;\n    transform: rotate(135deg);\n  }\n  100% {\n    stroke-dashoffset: 187;\n    transform: rotate(450deg);\n  }\n}`, \"\"]);\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);\n\n\n//# sourceURL=webpack://myweb/./src/scss/information.scss?./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

eval("\n\n/*\n  MIT License http://www.opensource.org/licenses/mit-license.php\n  Author Tobias Koppers @sokra\n*/\nmodule.exports = function (cssWithMappingToString) {\n  var list = [];\n\n  // return the list of modules as css string\n  list.toString = function toString() {\n    return this.map(function (item) {\n      var content = \"\";\n      var needLayer = typeof item[5] !== \"undefined\";\n      if (item[4]) {\n        content += \"@supports (\".concat(item[4], \") {\");\n      }\n      if (item[2]) {\n        content += \"@media \".concat(item[2], \" {\");\n      }\n      if (needLayer) {\n        content += \"@layer\".concat(item[5].length > 0 ? \" \".concat(item[5]) : \"\", \" {\");\n      }\n      content += cssWithMappingToString(item);\n      if (needLayer) {\n        content += \"}\";\n      }\n      if (item[2]) {\n        content += \"}\";\n      }\n      if (item[4]) {\n        content += \"}\";\n      }\n      return content;\n    }).join(\"\");\n  };\n\n  // import a list of modules into the list\n  list.i = function i(modules, media, dedupe, supports, layer) {\n    if (typeof modules === \"string\") {\n      modules = [[null, modules, undefined]];\n    }\n    var alreadyImportedModules = {};\n    if (dedupe) {\n      for (var k = 0; k < this.length; k++) {\n        var id = this[k][0];\n        if (id != null) {\n          alreadyImportedModules[id] = true;\n        }\n      }\n    }\n    for (var _k = 0; _k < modules.length; _k++) {\n      var item = [].concat(modules[_k]);\n      if (dedupe && alreadyImportedModules[item[0]]) {\n        continue;\n      }\n      if (typeof layer !== \"undefined\") {\n        if (typeof item[5] === \"undefined\") {\n          item[5] = layer;\n        } else {\n          item[1] = \"@layer\".concat(item[5].length > 0 ? \" \".concat(item[5]) : \"\", \" {\").concat(item[1], \"}\");\n          item[5] = layer;\n        }\n      }\n      if (media) {\n        if (!item[2]) {\n          item[2] = media;\n        } else {\n          item[1] = \"@media \".concat(item[2], \" {\").concat(item[1], \"}\");\n          item[2] = media;\n        }\n      }\n      if (supports) {\n        if (!item[4]) {\n          item[4] = \"\".concat(supports);\n        } else {\n          item[1] = \"@supports (\".concat(item[4], \") {\").concat(item[1], \"}\");\n          item[4] = supports;\n        }\n      }\n      list.push(item);\n    }\n  };\n  return list;\n};\n\n//# sourceURL=webpack://myweb/./node_modules/css-loader/dist/runtime/api.js?");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/noSourceMaps.js":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/noSourceMaps.js ***!
  \**************************************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = function (i) {\n  return i[1];\n};\n\n//# sourceURL=webpack://myweb/./node_modules/css-loader/dist/runtime/noSourceMaps.js?");

/***/ }),

/***/ "./src/scss/information.scss":
/*!***********************************!*\
  !*** ./src/scss/information.scss ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ \"./node_modules/style-loader/dist/runtime/styleDomAPI.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ \"./node_modules/style-loader/dist/runtime/insertBySelector.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ \"./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ \"./node_modules/style-loader/dist/runtime/insertStyleElement.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ \"./node_modules/style-loader/dist/runtime/styleTagTransform.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_information_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./information.scss */ \"./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/scss/information.scss\");\n\n      \n      \n      \n      \n      \n      \n      \n      \n      \n\nvar options = {};\n\noptions.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());\noptions.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());\noptions.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, \"head\");\noptions.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());\noptions.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());\n\nvar update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_information_scss__WEBPACK_IMPORTED_MODULE_6__[\"default\"], options);\n\n\n\n\n       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_information_scss__WEBPACK_IMPORTED_MODULE_6__[\"default\"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_information_scss__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_information_scss__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals : undefined);\n\n\n//# sourceURL=webpack://myweb/./src/scss/information.scss?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

eval("\n\nvar stylesInDOM = [];\nfunction getIndexByIdentifier(identifier) {\n  var result = -1;\n  for (var i = 0; i < stylesInDOM.length; i++) {\n    if (stylesInDOM[i].identifier === identifier) {\n      result = i;\n      break;\n    }\n  }\n  return result;\n}\nfunction modulesToDom(list, options) {\n  var idCountMap = {};\n  var identifiers = [];\n  for (var i = 0; i < list.length; i++) {\n    var item = list[i];\n    var id = options.base ? item[0] + options.base : item[0];\n    var count = idCountMap[id] || 0;\n    var identifier = \"\".concat(id, \" \").concat(count);\n    idCountMap[id] = count + 1;\n    var indexByIdentifier = getIndexByIdentifier(identifier);\n    var obj = {\n      css: item[1],\n      media: item[2],\n      sourceMap: item[3],\n      supports: item[4],\n      layer: item[5]\n    };\n    if (indexByIdentifier !== -1) {\n      stylesInDOM[indexByIdentifier].references++;\n      stylesInDOM[indexByIdentifier].updater(obj);\n    } else {\n      var updater = addElementStyle(obj, options);\n      options.byIndex = i;\n      stylesInDOM.splice(i, 0, {\n        identifier: identifier,\n        updater: updater,\n        references: 1\n      });\n    }\n    identifiers.push(identifier);\n  }\n  return identifiers;\n}\nfunction addElementStyle(obj, options) {\n  var api = options.domAPI(options);\n  api.update(obj);\n  var updater = function updater(newObj) {\n    if (newObj) {\n      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {\n        return;\n      }\n      api.update(obj = newObj);\n    } else {\n      api.remove();\n    }\n  };\n  return updater;\n}\nmodule.exports = function (list, options) {\n  options = options || {};\n  list = list || [];\n  var lastIdentifiers = modulesToDom(list, options);\n  return function update(newList) {\n    newList = newList || [];\n    for (var i = 0; i < lastIdentifiers.length; i++) {\n      var identifier = lastIdentifiers[i];\n      var index = getIndexByIdentifier(identifier);\n      stylesInDOM[index].references--;\n    }\n    var newLastIdentifiers = modulesToDom(newList, options);\n    for (var _i = 0; _i < lastIdentifiers.length; _i++) {\n      var _identifier = lastIdentifiers[_i];\n      var _index = getIndexByIdentifier(_identifier);\n      if (stylesInDOM[_index].references === 0) {\n        stylesInDOM[_index].updater();\n        stylesInDOM.splice(_index, 1);\n      }\n    }\n    lastIdentifiers = newLastIdentifiers;\n  };\n};\n\n//# sourceURL=webpack://myweb/./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

eval("\n\nvar memo = {};\n\n/* istanbul ignore next  */\nfunction getTarget(target) {\n  if (typeof memo[target] === \"undefined\") {\n    var styleTarget = document.querySelector(target);\n\n    // Special case to return head of iframe instead of iframe itself\n    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {\n      try {\n        // This will throw an exception if access to iframe is blocked\n        // due to cross-origin restrictions\n        styleTarget = styleTarget.contentDocument.head;\n      } catch (e) {\n        // istanbul ignore next\n        styleTarget = null;\n      }\n    }\n    memo[target] = styleTarget;\n  }\n  return memo[target];\n}\n\n/* istanbul ignore next  */\nfunction insertBySelector(insert, style) {\n  var target = getTarget(insert);\n  if (!target) {\n    throw new Error(\"Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.\");\n  }\n  target.appendChild(style);\n}\nmodule.exports = insertBySelector;\n\n//# sourceURL=webpack://myweb/./node_modules/style-loader/dist/runtime/insertBySelector.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

eval("\n\n/* istanbul ignore next  */\nfunction insertStyleElement(options) {\n  var element = document.createElement(\"style\");\n  options.setAttributes(element, options.attributes);\n  options.insert(element, options.options);\n  return element;\n}\nmodule.exports = insertStyleElement;\n\n//# sourceURL=webpack://myweb/./node_modules/style-loader/dist/runtime/insertStyleElement.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\n/* istanbul ignore next  */\nfunction setAttributesWithoutAttributes(styleElement) {\n  var nonce =  true ? __webpack_require__.nc : 0;\n  if (nonce) {\n    styleElement.setAttribute(\"nonce\", nonce);\n  }\n}\nmodule.exports = setAttributesWithoutAttributes;\n\n//# sourceURL=webpack://myweb/./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

eval("\n\n/* istanbul ignore next  */\nfunction apply(styleElement, options, obj) {\n  var css = \"\";\n  if (obj.supports) {\n    css += \"@supports (\".concat(obj.supports, \") {\");\n  }\n  if (obj.media) {\n    css += \"@media \".concat(obj.media, \" {\");\n  }\n  var needLayer = typeof obj.layer !== \"undefined\";\n  if (needLayer) {\n    css += \"@layer\".concat(obj.layer.length > 0 ? \" \".concat(obj.layer) : \"\", \" {\");\n  }\n  css += obj.css;\n  if (needLayer) {\n    css += \"}\";\n  }\n  if (obj.media) {\n    css += \"}\";\n  }\n  if (obj.supports) {\n    css += \"}\";\n  }\n  var sourceMap = obj.sourceMap;\n  if (sourceMap && typeof btoa !== \"undefined\") {\n    css += \"\\n/*# sourceMappingURL=data:application/json;base64,\".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), \" */\");\n  }\n\n  // For old IE\n  /* istanbul ignore if  */\n  options.styleTagTransform(css, styleElement, options.options);\n}\nfunction removeStyleElement(styleElement) {\n  // istanbul ignore if\n  if (styleElement.parentNode === null) {\n    return false;\n  }\n  styleElement.parentNode.removeChild(styleElement);\n}\n\n/* istanbul ignore next  */\nfunction domAPI(options) {\n  if (typeof document === \"undefined\") {\n    return {\n      update: function update() {},\n      remove: function remove() {}\n    };\n  }\n  var styleElement = options.insertStyleElement(options);\n  return {\n    update: function update(obj) {\n      apply(styleElement, options, obj);\n    },\n    remove: function remove() {\n      removeStyleElement(styleElement);\n    }\n  };\n}\nmodule.exports = domAPI;\n\n//# sourceURL=webpack://myweb/./node_modules/style-loader/dist/runtime/styleDomAPI.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

eval("\n\n/* istanbul ignore next  */\nfunction styleTagTransform(css, styleElement) {\n  if (styleElement.styleSheet) {\n    styleElement.styleSheet.cssText = css;\n  } else {\n    while (styleElement.firstChild) {\n      styleElement.removeChild(styleElement.firstChild);\n    }\n    styleElement.appendChild(document.createTextNode(css));\n  }\n}\nmodule.exports = styleTagTransform;\n\n//# sourceURL=webpack://myweb/./node_modules/style-loader/dist/runtime/styleTagTransform.js?");

/***/ }),

/***/ "./src/information.js":
/*!****************************!*\
  !*** ./src/information.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _scss_information_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scss/information.scss */ \"./src/scss/information.scss\");\n\r\n\r\n\r\n\r\n/*-----------------------loading--------------------*/\r\n$(window).on(\"load\", function () {\r\n    $(\".loading_wrapper\").fadeOut(\"slow\");\r\n});\r\n\r\n\r\n/*------------------------------------新增卡片功能-----------------------------------------*/\r\ndocument.getElementById('card-form').addEventListener('submit', function (event) {\r\n    event.preventDefault(); // 阻止表單的默認提交行為\r\n\r\n    // 獲取輸入的英文和中文\r\n    const englishText = document.getElementById('english-text').value;\r\n    const chineseText = document.getElementById('chinese-text').value;\r\n\r\n    // 創建新卡片\r\n    const newCard = document.createElement('div');\r\n    newCard.className = 'contantbox';\r\n\r\n    // 設置卡片內容\r\n    newCard.innerHTML = `\r\n        <h1>${englishText}</h1>\r\n        <p>${chineseText}</p>\r\n        <button class=\"edit-btn\">\r\n        <svg class=\"feather feather-edit\" fill=\"none\" height=\"24\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\">\r\n        <path d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"/><path d=\"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z\"/>\r\n        </svg></button>\r\n        <button class=\"delete-btn\">刪除</button>\r\n        \r\n    `;\r\n    // 將新卡片添加到容器\r\n    document.querySelector('.contair').appendChild(newCard);\r\n\r\n    // 綁定卡片的點擊事件，顯示對應的內容在 dialog 中\r\n    newCard.addEventListener('click', function () {\r\n        const dialog = document.getElementById('dialog');\r\n        const dialogContent = document.querySelector('#dialog');\r\n        // 將點擊的卡片內容顯示在 dialog 中\r\n        dialogContent.innerHTML = `\r\n        <a>${englishText}</a>\r\n        <a>${chineseText}</a>\r\n        <button id=\"close\" onclick=\"closedialog()\">X</button>\r\n        <audio id=\"audio\" src=\"audio.mp3\" controls></audio>\r\n    `;\r\n        // 顯示 dialog\r\n        dialog.showModal();\r\n\r\n    });\r\n    // 清空表單\r\n    document.getElementById('card-form').reset();\r\n});\r\n\r\n/*------------------------------------音訊卡片功能-----------------------------------------*/\r\nfunction toggleAudio(audioId, buttonId) {\r\n    let audioElement = document.getElementById(audioId);\r\n    let buttonElement = document.getElementById(buttonId).getElementsByTagName('img')[0];\r\n\r\n    if (audioElement.paused) {\r\n        audioElement.play();\r\n        buttonElement.src = \"/img/pause.png\";  // 修改為暫停圖標\r\n        buttonElement.alt = \"Pause\";\r\n    } else {\r\n        audioElement.pause();\r\n        buttonElement.src = \"/img/play.png\";  // 修改為播放圖標\r\n        buttonElement.alt = \"Play\";\r\n    }\r\n}\r\n\r\n// 為所有按鈕添加事件監聽器\r\ndocument.querySelectorAll('button').forEach(button => {\r\n    button.addEventListener('click', function () {\r\n        let audioId = this.previousElementSibling.id;\r\n        let buttonId = this.id;\r\n        toggleAudio(audioId, buttonId);\r\n    });\r\n});\r\n\r\n\r\n/*------------------跳窗--------------------*/\r\nfunction closedialog() {\r\n    dialog.close();\r\n}\n\n//# sourceURL=webpack://myweb/./src/information.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/information.js");
/******/ 	
/******/ })()
;