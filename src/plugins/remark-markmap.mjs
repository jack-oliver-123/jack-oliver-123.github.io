/**
 * Remark 插件：将 ```markmap 代码块转为原始 HTML，
 * 绕过 Shiki 语法高亮，保留 language-markmap 类名供客户端渲染。
 */
import { visit } from 'unist-util-visit';

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default function remarkMarkmap() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'markmap') return;

      const html = `<pre class="markmap-source"><code class="language-markmap">${escapeHtml(node.value)}</code></pre>`;

      parent.children[index] = {
        type: 'html',
        value: html,
      };
    });
  };
}
