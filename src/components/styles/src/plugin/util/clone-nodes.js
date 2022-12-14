export default function cloneNodes(nodes, source = undefined, raws = undefined) {
  return nodes.map((node) => {
    const cloned = node.clone();

    // We always want override the source map
    // except when explicitly told not to
    const shouldOverwriteSource = node.raws.aileron?.preserveSource !== true || !cloned.source;

    if (source !== undefined && shouldOverwriteSource) {
      cloned.source = source;

      if ("walk" in cloned) {
        cloned.walk((child) => {
          child.source = source;
        });
      }
    }

    if (raws !== undefined) {
      cloned.raws.aileron = {
        ...cloned.raws.aileron,
        ...raws
      };
    }

    return cloned;
  });
}
