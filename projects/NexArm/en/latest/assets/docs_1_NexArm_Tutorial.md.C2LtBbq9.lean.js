import { _ as _export_sfc, C as resolveComponent, o as openBlock, c as createElementBlock, j as createBaseVNode, a as createTextVNode, E as createVNode } from "./chunks/framework.DpT6eq5C.js";
const __pageData = JSON.parse('{"title":"NexArm","description":"","frontmatter":{},"headers":[],"relativePath":"docs/1_NexArm_Tutorial.md","filePath":"docs/1_NexArm_Tutorial.md"}');
const _sfc_main = { name: "docs/1_NexArm_Tutorial.md" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_KitVersionGuide = resolveComponent("KitVersionGuide");
  return openBlock(), createElementBlock("div", null, [
    _cache[0] || (_cache[0] = createBaseVNode("h1", {
      id: "nexarm",
      tabindex: "-1"
    }, [
      createTextVNode("NexArm "),
      createBaseVNode("a", {
        class: "header-anchor",
        href: "#nexarm",
        "aria-label": 'Permalink to "NexArm"'
      }, "​")
    ], -1)),
    createVNode(_component_KitVersionGuide)
  ]);
}
const _1_NexArm_Tutorial = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  __pageData,
  _1_NexArm_Tutorial as default
};
