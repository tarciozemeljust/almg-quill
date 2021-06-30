import React from 'react';
import ReactDOM from 'react-dom';

import Editor from './Editor';

const Command = {
  Play: () => {
    console.log('play f2');
  },
  Pause: () => {
    console.log('pause f4');
  },
  Rewind: () => {
    console.log('Rewind f5');
  },
  Forward: () => {
    console.log('Forward f7');
  }
};

class EditorUse extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorHtml: '' };
    this.handleChange = this.handleChange.bind(this);
    this.saveRequest = this.saveRequest.bind(this);
  }

  handleChange(html) {
    this.setState({ editorHtml: html });
  }

  saveRequest() {
    console.log('save');
  }

  hotKey(Command) {
    Command();
  }

  render() {
    return (
      <Editor
        placeholder="asdasas dasd"
        onChange={this.handleChange}
        editorHtml={this.state.editorHtml}
        onSaveRequest={this.saveRequest}
        onHotKey={this.hotKey}
        Command={Command}
        valorDefault="Valor default"
        readOnly={false}
        idQuarto="Teste"
        listaAutoTextos={[]}
      />
    );
  }
}

ReactDOM.render(<EditorUse />, document.getElementById('root'));
