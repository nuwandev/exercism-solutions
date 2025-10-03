export function degreesOfSeparation(
  familyTree: { [key: string]: string[] },
  personA: string,
  personB: string
): number {
  // Build adjacency with Sets so we don't add duplicate neighbours
  const graph = new Map<string, Set<string>>()

  for (const parent in familyTree) {
    const children = familyTree[parent] ?? []

    // ensure parent node exists
    if (!graph.has(parent)) graph.set(parent, new Set())

    // add parent <-> child edges
    for (const child of children) {
      if (!graph.has(child)) graph.set(child, new Set())
      graph.get(parent)!.add(child)
      graph.get(child)!.add(parent)
    }

    // add sibling edges: connect every pair of children directly
    for (let i = 0; i < children.length; i++) {
      for (let j = i + 1; j < children.length; j++) {
        const a = children[i]
        const b = children[j]
        graph.get(a)!.add(b)
        graph.get(b)!.add(a)
      }
    }
  }

  // quick checks
  if (personA === personB) return 0
  if (!graph.has(personA) || !graph.has(personB)) return -1

  // BFS
  const visited = new Set<string>([personA])
  const queue: Array<[string, number]> = [[personA, 0]]

  while (queue.length > 0) {
    const [current, dist] = queue.shift()! // safe: queue non-empty

    if (current === personB) return dist

    const neighbours = graph.get(current)
    if (!neighbours) continue

    for (const n of neighbours) {
      if (!visited.has(n)) {
        visited.add(n)
        queue.push([n, dist + 1])
      }
    }
  }

  return -1
}
