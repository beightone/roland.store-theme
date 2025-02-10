export function formatTextAsHTML(text: string) {
  let formattedText = text.replace('•', '').trim()

  formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  formattedText = formattedText.replace(/__(.+?)__/g, '<i>$1</i>')
  formattedText = formattedText.replace(/~~(.+?)~~/g, '<u>$1</u>')

  return formattedText
}
