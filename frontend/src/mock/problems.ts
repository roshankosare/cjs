import type { Problem } from "@/types/problem";

export const problems: Problem[] = [
  {
    id: 1,
    slug: "two-sum",
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "EASY",
    tags: ["Array", "Hash Table"],
    sampleTestCases: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9",
      },
    ],
    constraints: ["2 <= nums.length <= 10^4"],
    hints: ["Use a hash map to store visited numbers"],
  },
  {
    id: 2,
    slug: "reverse-string",
    title: "Reverse String",
    description: "Write a function that reverses a string.",
    difficulty: "EASY",
    tags: ["String"],
    sampleTestCases: [
      {
        input: 's = "hello"',
        output: '"olleh"',
      },
    ],
    constraints: ["1 <= s.length <= 10^5"],
  },
  {
    id: 3,
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    description:
      "Given a string containing brackets, determine if the input string is valid.",
    difficulty: "EASY",
    tags: ["Stack", "String"],
    sampleTestCases: [
      {
        input: 's = "()[]{}"',
        output: "true",
      },
    ],
    hints: ["Use a stack"],
  },
  {
    id: 4,
    slug: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    description:
      "Merge two sorted linked lists and return it as a sorted list.",
    difficulty: "MEDIUM",
    tags: ["Linked List"],
    sampleTestCases: [
      {
        input: "l1 = [1,2,4], l2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
      },
    ],
  },
  {
    id: 5,
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    description:
      "Find the length of the longest substring without repeating characters.",
    difficulty: "MEDIUM",
    tags: ["String", "Sliding Window"],
    sampleTestCases: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc"',
      },
    ],
  },
  {
    id: 6,
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    description: "Search for a target value in a rotated sorted array.",
    difficulty: "MEDIUM",
    tags: ["Array", "Binary Search"],
    sampleTestCases: [
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4",
      },
    ],
  },
  {
    id: 7,
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    description:
      "You can climb either 1 or 2 steps. In how many distinct ways can you reach the top?",
    difficulty: "MEDIUM",
    tags: ["Dynamic Programming"],
    sampleTestCases: [
      {
        input: "n = 3",
        output: "3",
      },
    ],
  },
  {
    id: 8,
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    description: "Find the contiguous subarray which has the largest sum.",
    difficulty: "HARD",
    tags: ["Array", "Dynamic Programming"],
    sampleTestCases: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "Subarray [4,-1,2,1]",
      },
    ],
  },
  {
    id: 9,
    slug: "serialize-and-deserialize-binary-tree",
    title: "Serialize and Deserialize Binary Tree",
    description:
      "Design an algorithm to serialize and deserialize a binary tree.",
    difficulty: "HARD",
    tags: ["Tree", "DFS", "BFS"],
    sampleTestCases: [
      {
        input: "root = [1,2,3,null,null,4,5]",
        output: "[1,2,3,null,null,4,5]",
      },
    ],
  },
  {
    id: 10,
    slug: "binary-tree-inorder-traversal",
    title: "Binary Tree Inorder Traversal",
    description: "Return the inorder traversal of a binary tree.",
    difficulty: "EASY",
    tags: ["Tree", "DFS"],
    sampleTestCases: [
      {
        input: "root = [1,null,2,3]",
        output: "[1,3,2]",
      },
    ],
  },
  {
    id: 11,
    slug: "fibonacci-number",
    title: "Fibonacci Number",
    description: "Calculate the nth Fibonacci number.",
    difficulty: "EASY",
    tags: ["Recursion", "Dynamic Programming"],
    sampleTestCases: [
      {
        input: "n = 4",
        output: "3",
      },
    ],
  },
  {
    id: 12,
    slug: "graph-valid-tree",
    title: "Graph Valid Tree",
    description: "Determine if the given edges form a valid tree.",
    difficulty: "HARD",
    tags: ["Graph", "Union Find"],
    sampleTestCases: [
      {
        input: "n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]",
        output: "true",
      },
    ],
  },
];
