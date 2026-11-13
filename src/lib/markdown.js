import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

function documentMetadata() {
  return (tree, file) => {
    const toc = [];
    const text = node => node.type === 'text' ? node.value : (node.children || []).map(text).join('');
    function visit(node) {
      if (node.type === 'element') {
        if (/^h[1-3]$/.test(node.tagName)) toc.push({ id:node.properties.id, level:Number(node.tagName[1]), title:text(node) });
        for (const key of ['href', 'src']) {
          const value = String(node.properties?.[key] || '').replace(/[\u0000-\u0020]/g, '');
          if (/^(javascript|vbscript|data):/i.test(value)) delete node.properties[key];
        }
      }
      node.children?.forEach(visit);
    }
    visit(tree);
    file.data.toc = toc;
  };
}

const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMath)
  .use(remarkRehype) // Raw HTML in Markdown is not executed or inserted.
  .use(rehypeSlug, { prefix:'md-' }).use(documentMetadata)
  .use(rehypeKatex, { strict:'ignore', trust:false })
  .use(rehypeHighlight, { detect:false, ignoreMissing:true }).use(rehypeStringify);

export function renderMarkdown(markdown) {
  const result = processor.processSync(markdown);
  return { html:String(result), toc:result.data.toc };
}
