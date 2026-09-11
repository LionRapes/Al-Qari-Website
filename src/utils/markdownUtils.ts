import MarkdownIt from 'markdown-it'

export const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

export const renderMarkdown = (text: string) => md.render(text)
