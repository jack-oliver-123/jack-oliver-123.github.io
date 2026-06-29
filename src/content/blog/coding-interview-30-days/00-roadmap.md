---
title: "30 天速通秋招笔试题"
description: "面向秋招笔试的一个月刷题总纲：按高频题型组织每日题库，覆盖数组、链表、树、图、动态规划和模拟笔试。"
pubDate: 2026-06-29
updatedDate: 2026-06-29
tags: ["算法", "笔试", "秋招", "LeetCode"]
draft: false
featured: false
---

## 为什么要有这份题单

目标不是把所有题都刷完，而是在一个月内建立“看到题就知道该用哪类模板”的能力。

这份计划适合三种场景：

1. 距离秋招笔试还有一个月，需要快速恢复算法手感；
2. 已经学过数据结构和算法，但题型迁移能力不稳定；
3. 想用一份清单把高频题、模板和复盘串起来。

题目来源主要参考这些公开高频题单：

- [LeetCode Top Interview 150](https://leetcode.com/studyplan/top-interview-150/)：官方面试经典题单，覆盖数组、字符串、链表、树、图、DP 等综合主题。
- [LeetCode 热题 HOT 100](https://leetcode.cn/problem-list/2cktkvj/)：中文站热门 100 题，适合短时间建立常见题型直觉。
- [Blind 75](https://leetcode.com/discuss/post/460599/blind-75-leetcode-questions-by-krishnade-9xev/)：经典面试题单，题量更克制，适合做第一轮核心训练。
- [LeetcodeTop](https://github.com/afatcoder/LeetcodeTop)：汇总互联网公司高频 LeetCode 题，适合作为秋招公司题补充。

## 刷题规则

每天默认节奏：

- 先用 10 分钟复盘昨天错题；
- 再用 90 到 120 分钟完成当天核心题；
- 最后用 20 分钟整理模板、坑点和复杂度；
- 每 7 天做一次混合模拟，不按题型提示做题。

每道题只追求三件事：

1. 能独立写出通过代码；
2. 能说清楚为什么这样做；
3. 能把同类题抽象成模板。

如果一道题 25 分钟没有思路，就看题解，但要重新关掉题解再写一遍。

## 30 天每日题库

| 天数 | 主题 | 核心题 | 加练题 | 当天要沉淀的模板 |
| --- | --- | --- | --- | --- |
| Day 01 | 数组与哈希入门 | [两数之和](https://leetcode.cn/problems/two-sum/)、[存在重复元素](https://leetcode.cn/problems/contains-duplicate/)、[有效的字母异位词](https://leetcode.cn/problems/valid-anagram/)、[最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/) | [字母异位词分组](https://leetcode.cn/problems/group-anagrams/) | 哈希表计数、集合去重、一次遍历 |
| Day 02 | 双指针 | [移动零](https://leetcode.cn/problems/move-zeroes/)、[盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)、[三数之和](https://leetcode.cn/problems/3sum/)、[删除有序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/) | [接雨水](https://leetcode.cn/problems/trapping-rain-water/) | 左右指针、快慢指针、排序后去重 |
| Day 03 | 滑动窗口 | [无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)、[最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)、[找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/)、[长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/) | [替换后的最长重复字符](https://leetcode.cn/problems/longest-repeating-character-replacement/) | 窗口扩张收缩、窗口内状态维护 |
| Day 04 | 前缀和与差分 | [和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)、[除自身以外数组的乘积](https://leetcode.cn/problems/product-of-array-except-self/)、[区域和检索](https://leetcode.cn/problems/range-sum-query-immutable/)、[二维区域和检索](https://leetcode.cn/problems/range-sum-query-2d-immutable/) | [航班预订统计](https://leetcode.cn/problems/corporate-flight-bookings/) | 前缀和、差分数组、贡献拆分 |
| Day 05 | 字符串与模拟 | [验证回文串](https://leetcode.cn/problems/valid-palindrome/)、[字符串相加](https://leetcode.cn/problems/add-strings/)、[Z 字形变换](https://leetcode.cn/problems/zigzag-conversion/)、[最长公共前缀](https://leetcode.cn/problems/longest-common-prefix/) | [比较版本号](https://leetcode.cn/problems/compare-version-numbers/) | 字符串扫描、边界处理、模拟题拆步骤 |
| Day 06 | 排序与二分 | [搜索插入位置](https://leetcode.cn/problems/search-insert-position/)、[搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/)、[寻找两个正序数组的中位数](https://leetcode.cn/problems/median-of-two-sorted-arrays/)、[在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/) | [寻找旋转排序数组中的最小值](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/) | 二分边界、答案二分、旋转数组判断 |
| Day 07 | 第一轮模拟 | 从 Day 01 到 Day 06 各抽 1 题限时完成 | 复盘所有未一次通过题 | 限时做题、错题分类、模板补全 |
| Day 08 | 栈与单调栈 | [有效的括号](https://leetcode.cn/problems/valid-parentheses/)、[最小栈](https://leetcode.cn/problems/min-stack/)、[每日温度](https://leetcode.cn/problems/daily-temperatures/)、[柱状图中最大的矩形](https://leetcode.cn/problems/largest-rectangle-in-histogram/) | [接雨水](https://leetcode.cn/problems/trapping-rain-water/) | 单调栈、括号匹配、栈内元素含义 |
| Day 09 | 队列与堆 | [滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)、[前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)、[数组中的第 K 个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/)、[合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/) | [数据流的中位数](https://leetcode.cn/problems/find-median-from-data-stream/) | 优先队列、双堆、懒删除思路 |
| Day 10 | 链表基础 | [反转链表](https://leetcode.cn/problems/reverse-linked-list/)、[合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)、[环形链表](https://leetcode.cn/problems/linked-list-cycle/)、[相交链表](https://leetcode.cn/problems/intersection-of-two-linked-lists/) | [回文链表](https://leetcode.cn/problems/palindrome-linked-list/) | 虚拟头结点、快慢指针、链表断开与重连 |
| Day 11 | 链表进阶 | [两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/)、[K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/)、[删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)、[排序链表](https://leetcode.cn/problems/sort-list/) | [复制带随机指针的链表](https://leetcode.cn/problems/copy-list-with-random-pointer/) | 局部翻转、递归链表、归并排序链表 |
| Day 12 | 二叉树 DFS | [二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)、[翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/)、[路径总和](https://leetcode.cn/problems/path-sum/)、[二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/) | [从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) | 前中后序、递归返回值设计 |
| Day 13 | 二叉树 BFS 与层序 | [二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)、[二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/)、[二叉树的锯齿形层序遍历](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/)、[填充每个节点的下一个右侧节点指针](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/) | [完全二叉树的节点个数](https://leetcode.cn/problems/count-complete-tree-nodes/) | 队列层序、按层处理、宽度统计 |
| Day 14 | 第二轮模拟 | 栈、堆、链表、二叉树混合限时 4 题 | 复盘链表和树的指针错误 | 指针题画图、递归出口、复杂度复述 |
| Day 15 | 二叉搜索树 | [验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)、[二叉搜索树中第 K 小的元素](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/)、[二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)、[将有序数组转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/) | [删除二叉搜索树中的节点](https://leetcode.cn/problems/delete-node-in-a-bst/) | 中序有序性、搜索树递归边界 |
| Day 16 | 回溯基础 | [全排列](https://leetcode.cn/problems/permutations/)、[子集](https://leetcode.cn/problems/subsets/)、[组合总和](https://leetcode.cn/problems/combination-sum/)、[括号生成](https://leetcode.cn/problems/generate-parentheses/) | [电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/) | 选择列表、路径、撤销选择 |
| Day 17 | 回溯进阶 | [单词搜索](https://leetcode.cn/problems/word-search/)、[分割回文串](https://leetcode.cn/problems/palindrome-partitioning/)、[N 皇后](https://leetcode.cn/problems/n-queens/)、[复原 IP 地址](https://leetcode.cn/problems/restore-ip-addresses/) | [解数独](https://leetcode.cn/problems/sudoku-solver/) | 剪枝、去重、二维搜索状态 |
| Day 18 | 贪心 | [买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)、[跳跃游戏](https://leetcode.cn/problems/jump-game/)、[跳跃游戏 II](https://leetcode.cn/problems/jump-game-ii/)、[划分字母区间](https://leetcode.cn/problems/partition-labels/) | [加油站](https://leetcode.cn/problems/gas-station/) | 局部最优、覆盖范围、反证直觉 |
| Day 19 | 动态规划入门 | [爬楼梯](https://leetcode.cn/problems/climbing-stairs/)、[打家劫舍](https://leetcode.cn/problems/house-robber/)、[最大子数组和](https://leetcode.cn/problems/maximum-subarray/)、[乘积最大子数组](https://leetcode.cn/problems/maximum-product-subarray/) | [零钱兑换](https://leetcode.cn/problems/coin-change/) | 状态定义、转移方程、初始化 |
| Day 20 | 动态规划背包 | [零钱兑换 II](https://leetcode.cn/problems/coin-change-ii/)、[分割等和子集](https://leetcode.cn/problems/partition-equal-subset-sum/)、[目标和](https://leetcode.cn/problems/target-sum/)、[完全平方数](https://leetcode.cn/problems/perfect-squares/) | [一和零](https://leetcode.cn/problems/ones-and-zeroes/) | 01 背包、完全背包、滚动数组 |
| Day 21 | 第三轮模拟 | 回溯、贪心、DP 混合限时 4 题 | 复盘所有 DP 状态设计错误 | 状态压缩、样例推导、转移检查 |
| Day 22 | 子序列 DP | [最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)、[最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)、[编辑距离](https://leetcode.cn/problems/edit-distance/)、[不同路径](https://leetcode.cn/problems/unique-paths/) | [最长回文子序列](https://leetcode.cn/problems/longest-palindromic-subsequence/) | 一维/二维 DP、序列匹配、边界初始化 |
| Day 23 | 区间与博弈 DP | [最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)、[回文子串](https://leetcode.cn/problems/palindromic-substrings/)、[戳气球](https://leetcode.cn/problems/burst-balloons/)、[预测赢家](https://leetcode.cn/problems/predict-the-winner/) | [石子游戏](https://leetcode.cn/problems/stone-game/) | 区间枚举顺序、左右端点状态 |
| Day 24 | 图 BFS/DFS | [岛屿数量](https://leetcode.cn/problems/number-of-islands/)、[腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/)、[课程表](https://leetcode.cn/problems/course-schedule/)、[克隆图](https://leetcode.cn/problems/clone-graph/) | [太平洋大西洋水流问题](https://leetcode.cn/problems/pacific-atlantic-water-flow/) | 邻接表、访问标记、拓扑排序 |
| Day 25 | 并查集与图进阶 | [冗余连接](https://leetcode.cn/problems/redundant-connection/)、[省份数量](https://leetcode.cn/problems/number-of-provinces/)、[账户合并](https://leetcode.cn/problems/accounts-merge/)、[最小高度树](https://leetcode.cn/problems/minimum-height-trees/) | [连接所有点的最小费用](https://leetcode.cn/problems/min-cost-to-connect-all-points/) | 并查集、连通分量、最小生成树直觉 |
| Day 26 | Trie 与位运算 | [实现 Trie](https://leetcode.cn/problems/implement-trie-prefix-tree/)、[单词搜索 II](https://leetcode.cn/problems/word-search-ii/)、[只出现一次的数字](https://leetcode.cn/problems/single-number/)、[数组中两个数的最大异或值](https://leetcode.cn/problems/maximum-xor-of-two-numbers-in-an-array/) | [位 1 的个数](https://leetcode.cn/problems/number-of-1-bits/) | 前缀树、异或性质、位运算枚举 |
| Day 27 | 数学与模拟笔试 | [快乐数](https://leetcode.cn/problems/happy-number/)、[Pow(x, n)](https://leetcode.cn/problems/powx-n/)、[多数元素](https://leetcode.cn/problems/majority-element/)、[螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/) | [矩阵置零](https://leetcode.cn/problems/set-matrix-zeroes/) | 快速幂、摩尔投票、矩阵边界 |
| Day 28 | 第四轮模拟 | 随机混合 5 题，限制总时长 2 小时 | 复盘超时题 | 取舍策略、先易后难、题目分层 |
| Day 29 | 公司高频补漏 | [LRU 缓存](https://leetcode.cn/problems/lru-cache/)、[LFU 缓存](https://leetcode.cn/problems/lfu-cache/)、[基本计算器](https://leetcode.cn/problems/basic-calculator/)、[设计推特](https://leetcode.cn/problems/design-twitter/) | [最大频率栈](https://leetcode.cn/problems/maximum-frequency-stack/) | 设计题数据结构组合 |
| Day 30 | 终局模拟与复盘 | 一套完整笔试：数组/树/图/DP/模拟各 1 题 | 回刷错题 Top 10 | 模板总表、错题闭环、秋招前保温计划 |

## 高频题型优先级

如果时间不够，按这个顺序保底：

1. 数组、哈希、双指针、滑动窗口；
2. 栈、堆、链表、二叉树；
3. 二分、回溯、贪心；
4. 动态规划；
5. 图、并查集、Trie、设计题。

笔试里最容易拿分的是前两类，因为题型稳定、模板短、边界可控。动态规划和图题收益高，但需要更强的状态设计和调试能力。

## 每日复盘模板

每晚用这个格式记录到 `notes/` 目录：

````md
# Day XX 复盘

## 今天完成

- [ ] 题目 1：
- [ ] 题目 2：
- [ ] 题目 3：
- [ ] 题目 4：

## 没有一次通过的原因

- 思路问题：
- 边界问题：
- 代码实现问题：
- 复杂度问题：

## 明天要回刷

- [ ] 

## 今日模板

```text
写下今天最值得背下来的模板或伪代码。
```
````

## 刷题时的判定标准

一道题是否真正掌握，不看是否“看懂题解”，只看下面四个问题：

- 能不能在 20 到 30 分钟内独立写出？
- 能不能解释为什么这个数据结构适合？
- 能不能说出时间复杂度和空间复杂度？
- 能不能举出一个容易写错的边界样例？

如果四个问题有一个答不上来，就进入错题池，隔 2 天、7 天、14 天分别回刷一次。

## 一个月后的目标

30 天结束时，至少要沉淀出这些东西：

- 一份自己的高频题错题池；
- 一份常用模板清单；
- 一套 2 小时笔试做题节奏；
- 对数组、链表、树、DP、图的基本题型反射。

秋招笔试拼的不是刷题数量，而是题型识别速度、代码稳定性和限时取舍能力。
