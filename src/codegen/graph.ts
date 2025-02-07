export class Graph<T> {
  nodes: Map<string, T> = new Map();

  edges: Map<string, Set<string>> = new Map();

  addNode(name: string, data: T) {
    if (this.nodes.has(name)) {
      throw new Error(`"${name}" was defined more than once`);
    }

    this.nodes.set(name, data);
    this.edges.set(name, new Set());
  }

  addEdge(to: string, from: string) {
    if (!this.nodes.has(from) || !this.nodes.has(to)) {
      return;
    }

    this.edges.get(from)!.add(to);
  }

  cycleTolerantTopSort() {
    const order: string[] = [];
    const seen: Record<string, true> = {};

    const sort = (start: string) => {
      if (seen[start]) {
        return;
      }

      const pathHas: Record<string, true> = {};
      const path: string[] = [];
      const stack: {
        node: string;
        visiting: boolean;
      }[] = [];

      stack.push({
        node: start,
        visiting: true,
      });

      while (stack.length > 0) {
        const top = stack.at(-1)!;

        if (!top.visiting) {
          stack.pop();
          path.pop();
          delete pathHas[top.node];
          seen[top.node] = true;
          order.push(top.node);
        } else {
          if (seen[top.node] || pathHas[top.node]) {
            stack.pop();
            continue;
          }

          pathHas[top.node] = true;
          top.visiting = false;
          path.push(top.node);
          stack.push(
            ...Array.from(this.edges.get(top.node)!)
              .map((node) => ({
                node,
                visiting: true,
              })),
          );
        }
      }
    };

    Array.from(this.nodes.entries())
      .forEach(([node]) => sort(node));

    return order.map((node) => this.nodes.get(node)!);
  }
}
