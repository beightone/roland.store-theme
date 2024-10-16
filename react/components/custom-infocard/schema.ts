export const CUSTOM_INFOCARD_SCHEMA = {
  type: 'object',
  properties: {
    cards: {
      title: 'Cards',
      type: 'array',
      items: {
        title: 'Card',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Nome do card (para organização)',
            type: 'string',
          },
          visible: {
            title: 'Visivel',
            type: 'boolean',
            default: true,
          },
          image: {
            title: 'Imagem de fundo',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          hoverImage: {
            title: 'Imagem no hover',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          title: {
            title: 'Título',
            type: 'string',
            default: '',
          },
          link: {
            title: 'Link de redirecionamento',
            type: 'string',
            default: '',
          },
          buttonLabel: {
            title: 'Button Label',
            type: 'string',
            default: 'Ver tudo',
          },
        },
      },
    },
  },
}
