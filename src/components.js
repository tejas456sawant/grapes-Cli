export default (editor, options) => {
  editor.DomComponents.addType('my-component', {
    model: {
      defaults: {
        tagName: 'div',
        attributes: { class: 'my-component' },
        components: [
          {
            tagName: 'span',
            content: 'My Component Content'
          }
        ],
        style: {
          padding: '20px',
          margin: '10px',
          background: '#f1f1f1'
        }
      }
    }
  });
}