function partitionRules(root) {
  if (!root.walkAtRules) return;

  const applyParents = new Set();

  root.walkAtRules("apply", (rule) => {
    applyParents.add(rule.parent);
  });

  if (applyParents.size === 0) {
    return;
  }

  for (const rule of applyParents) {
    const nodeGroups = [];
    let lastGroup = [];

    for (const node of rule.nodes) {
      if (node.type === "atrule" && node.name === "apply") {
        if (lastGroup.length > 0) {
          nodeGroups.push(lastGroup);
          lastGroup = [];
        }
        nodeGroups.push([node]);
      } else {
        lastGroup.push(node);
      }
    }

    if (lastGroup.length > 0) {
      nodeGroups.push(lastGroup);
    }

    if (nodeGroups.length === 1) {
      continue;
    }

    for (const group of [...nodeGroups].reverse()) {
      const clone = rule.clone({ nodes: [] });
      clone.append(group);
      rule.after(clone);
    }

    rule.remove();
  }
}

export default function expandApplyAtRules() {
  return (root) => {
    partitionRules(root);
  };
}
