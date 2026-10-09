// ============================================================
// Priority Queue — Max Heap Implementation
// ============================================================
// This is a key DSA component of the Smart Campus Lost & Found.
//
// A Max Heap is a complete binary tree where each parent node
// is greater than or equal to its children. We use an array
// representation where for index i:
//   parent      = Math.floor((i - 1) / 2)
//   left child  = 2 * i + 1
//   right child = 2 * i + 2
//
// Time Complexities:
//   insert()      — O(log n)  (bubble up)
//   extractMax()  — O(log n)  (bubble down)
//   peek()        — O(1)
//   size()        — O(1)
//   isEmpty()     — O(1)
// ============================================================

export class PriorityQueue<T> {
  private heap: T[] = [];
  private comparator: (a: T, b: T) => number;

  /**
   * @param comparator  Return positive if `a` has higher priority than `b`.
   *                    E.g. (a, b) => a.score - b.score puts higher scores first.
   */
  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
  }

  // ---- Core public API ----

  /** Insert a new element into the heap — O(log n) */
  insert(value: T): void {
    this.heap.push(value);
    this._bubbleUp(this.heap.length - 1);
  }

  /** Remove and return the element with the highest priority — O(log n) */
  extractMax(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const max = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }
    return max;
  }

  /** Return the highest-priority element without removing it — O(1) */
  peek(): T | undefined {
    return this.heap[0];
  }

  /** Number of elements in the queue — O(1) */
  size(): number {
    return this.heap.length;
  }

  /** Whether the queue is empty — O(1) */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /** Drain all elements in priority order into an array */
  toSortedArray(): T[] {
    // Create a copy so the original heap is not destroyed
    const copy = new PriorityQueue<T>(this.comparator);
    copy.heap = [...this.heap];
    const result: T[] = [];
    while (!copy.isEmpty()) {
      result.push(copy.extractMax()!);
    }
    return result;
  }

  /** Return the internal heap array (for visualization only) */
  getHeapArray(): T[] {
    return [...this.heap];
  }

  // ---- Internal helpers ----

  /**
   * Bubble-up: after inserting at the end, move the element up
   * until the heap property is restored.
   */
  private _bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      // If current element has higher priority than parent, swap
      if (this.comparator(this.heap[index], this.heap[parentIndex]) > 0) {
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  /**
   * Bubble-down: after replacing the root, move the element down
   * until the heap property is restored.
   */
  private _bubbleDown(index: number): void {
    const length = this.heap.length;
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let largest = index;

      if (
        leftChild < length &&
        this.comparator(this.heap[leftChild], this.heap[largest]) > 0
      ) {
        largest = leftChild;
      }

      if (
        rightChild < length &&
        this.comparator(this.heap[rightChild], this.heap[largest]) > 0
      ) {
        largest = rightChild;
      }

      if (largest !== index) {
        [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
        index = largest;
      } else {
        break;
      }
    }
  }
}
