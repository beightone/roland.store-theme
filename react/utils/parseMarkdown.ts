import marked from 'marked'

export function parseMarkdown(text: string) {
  const rawMarkup = marked.parse(text)

  return { __html: rawMarkup }
}
