import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.css';

const ParagraphButton = ({ onClick, isAllCharsActive }) => (
  <span className={isAllCharsActive ? 'is-active' : ''} onClick={onClick}>
    <svg class="ql-custom-icon" viewBox="0 -20 125 125">
      <path
        class="ql-fill ql-stroke"
        d="M95.263 12.29V2.277A2.276 2.276 0 0092.987 0H36.921C25.539 0 17.05 2.442 10.969 7.47c-6.364 5.265-9.594 12.724-9.594 22.167 0 10.367 3.124 18.054 9.547 23.499 6.399 5.423 15.696 8.175 27.63 8.175h10.38v33.051a2.277 2.277 0 002.278 2.277h7.096a2.277 2.277 0 002.276-2.277V14.566h9.146v79.795a2.277 2.277 0 002.277 2.276h6.873a2.278 2.278 0 002.277-2.276V14.566h11.83a2.275 2.275 0 002.278-2.276z"
      />
    </svg>
  </span>
);

function undo() {
  this.quill.history.undo();
}

function redo() {
  this.quill.history.redo();
}

function copy() {
  document.execCommand('copy');
}

function cut() {
  document.execCommand('cut');
}

function clipboardHtml() {
  navigator.clipboard.read().then(data => {
    for (let i = 0; i < data.length; i++) {
      data[i].getType('text/html').then(blob => {
        blob.text().then(text => {
          this.quill.clipboard.dangerouslyPasteHTML(
            this.quill.getSelection().index,
            text
          );
        });
      });
    }
  });
}

function clipboardRaw() {
  navigator.clipboard.readText().then(text => {
    this.quill.clipboard.dangerouslyPasteHTML(
      this.quill.getSelection().index,
      text.replace(/<\/?[^>]+(>|$)/g, '')
    );
  });
}

const isDocumentScrollAtBottom = event => {
  let $el = event.target;
  let nearBottom =
    $el.scrollHeight - Math.abs($el.scrollTop) - 60 >= $el.clientHeight;

  return !nearBottom;
};

const setDocumentScrollAtBottom = event => {
  let $el = event.target;
  $el.scrollTop = 9999999999;
  // document.documentElement.scrollTop = 9999999999;
};

const CustomToolbar = ({ onToggleAllChars, isAllCharsActive }) => (
  <div id="toolbar">
    <span className="ql-formats">
      <select
        className="ql-header"
        defaultValue={''}
        onChange={e => e.persist()}
      >
        <option value="1" />
        <option value="2" />
        <option selected />
      </select>
    </span>

    <span className="ql-formats">
      <button className="ql-bold" title="Negrito" />
      <button className="ql-italic" title="Itálico" />
      <select
        title="Alinhamento"
        className="ql-align"
        defaultValue={''}
        onChange={e => e.persist()}
      >
        <option selected />
        <option value="center" />
        <option value="right" />
      </select>
    </span>

    <span className="ql-formats">
      <button className="ql-undo" title="Desfazer">
        <svg viewbox="0 0 18 18" class="ql-custom-icon">
          <polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
          <path
            class="ql-stroke"
            d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
          />
        </svg>
      </button>

      <button className="ql-redo" title="Refazer">
        <svg viewbox="0 0 18 18" class="ql-custom-icon">
          <polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
          <path
            class="ql-stroke"
            d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
          />
        </svg>
      </button>
    </span>

    <span className="ql-formats">
      <button className="ql-script" value="sub" title="Sobrescrito">
        sub
      </button>
      <button className="ql-script" value="super" title="Subscrito">
        sup
      </button>
    </span>

    <span className="ql-formats">
      <button className="ql-copy" title="Copiar">
        <svg class="ql-custom-icon" viewBox="0 0 25 25">
          <path d="M14.016 12H19.5l-5.484-5.484V12zM15 5.016l6 6V21q0 .797-.61 1.406t-1.406.61H7.97q-.797 0-1.383-.61T6 21V6.984q0-.796.61-1.382t1.406-.586H15zm.984-4.032V3h-12v14.016H2.016V3q0-.797.586-1.406t1.382-.61h12z" />
        </svg>
      </button>
      <button className="ql-cut" title="Recortar">
        <svg class="ql-custom-icon" viewBox="0 3 20 20">
          <path d="M20.625 5.515c-1-1.522-2.915-1.67-4.397-.824l-.186.107a3.162 3.162 0 00-2.68 1.366.762.762 0 00-.034.045c-.43.645-.723 1.236-1.005 1.809-.255.516-.5 1.01-.824 1.483-.325-.475-.57-.97-.826-1.486-.283-.571-.575-1.162-1.004-1.806a.36.36 0 00-.033-.044 3.159 3.159 0 00-2.603-1.37 3.17 3.17 0 00-3.167 3.166 3.171 3.171 0 003.167 3.168c.775 0 1.515-.287 2.087-.791l.652 1.198c-1.621 1.876-2.979 4.054-3.019 4.121-1.236 1.702.705 4.42.789 4.534a.498.498 0 00.405.207.511.511 0 00.439-.26l3.112-5.718 3.113 5.717a.5.5 0 00.407.26.477.477 0 00.437-.206c.083-.114 2.024-2.832.809-4.504l-.323-.52c-1.076-1.737-1.187-1.917-2.715-3.635l.651-1.195a3.16 3.16 0 005.255-2.377c0-.634-.191-1.246-.547-1.768.472-.27.997-.123 1.456.095.466.191.897-.377.584-.772zM7 9a1 1 0 110-2 1 1 0 010 2zm4.5 3.395a.5.5 0 110-1 .5.5 0 010 1zM16 9a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
      <button className="ql-clipboardHtml" title="Colar">
        <svg class="ql-custom-icon" viewBox="0 -1 20 20">
          <path d="M15.6 2l-1.2 3H5.6L4.4 2C3.629 2 3 2.629 3 3.4v15.2c0 .77.629 1.4 1.399 1.4h11.2c.77 0 1.4-.631 1.4-1.4V3.4C17 2.629 16.369 2 15.6 2zm-2 2l.9-2h-2.181L11.6 0H8.4l-.72 2H5.5l.899 2H13.6z" />
        </svg>
      </button>
      <button className="ql-clipboardRaw" title="Colar sem formatação">
        <svg class="ql-custom-icon" viewBox="0 2 28 28">
          <path d="M13 5V3.998C13 2.898 13.898 2 15.005 2h.99C17.106 2 18 2.894 18 3.998V5h2.004c.551 0 .996.447.996.999v1.002a.994.994 0 01-.996.999h-9.008A.997.997 0 0110 7.001V6c0-.556.446-.999.996-.999H13zm9 1h1.003C24.109 6 25 6.897 25 8.004v20.992A1.996 1.996 0 0123.003 31H7.997A1.998 1.998 0 016 28.996V8.004C6 6.89 6.894 6 7.997 6H9v.995C9 8.102 9.894 9 11.003 9h8.994A2.001 2.001 0 0022 6.995v-.99V6zm-6.5-1a.5.5 0 100-1 .5.5 0 000 1zM9 13v1h13v-1H9zm0 3v1h13v-1H9zm0 3v1h13v-1H9zm0 3v1h13v-1H9zm0 3v1h13v-1H9z" />
        </svg>
      </button>
    </span>

    <span className="ql-formats">
      <button title="Mostrar caracteres invisíveis">
        <ParagraphButton
          onClick={onToggleAllChars}
          isAllCharsActive={isAllCharsActive}
        />
      </button>
    </span>
  </div>
);

/*
 * Editor component with custom toolbar and content containers
 */
class Editor extends React.Component {
  constructor(props) {
    super(props);

    this._quill = React.createRef();

    this.state = { isAllCharsActive: false };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClickToggleAllChars = this.handleClickToggleAllChars.bind(this);
  }

  handleClickToggleAllChars() {
    this.setState({ isAllCharsActive: !this.state.isAllCharsActive });
  }

  handleKeyDown(event) {
    this.processPlayerKeys(event);
    this.processSave(event);
    // console.log(isDocumentScrollAtBottom(event));
    if (isDocumentScrollAtBottom(event)) {
      setDocumentScrollAtBottom(event);
    }
  }

  processSave(event) {
    if (event.key == 's' && event.ctrlKey) {
      event.preventDefault();
      this.props.onSaveRequest();
    }
  }

  processPlayerKeys(event) {
    if (event.key == 'F2') {
      event.preventDefault();
      this.props.onHotKey(this.props.Command.Play);
    }
    if (event.key == 'F4') {
      event.preventDefault();
      this.props.onHotKey(this.props.Command.Pause);
    }
    if (event.key == 'F5') {
      event.preventDefault();
      this.props.onHotKey(this.props.Command.Rewind);
    }

    if (event.key == 'F7') {
      event.preventDefault();
      this.props.onHotKey(this.props.Command.Forward);
    }
  }

  render() {
    // PROMISSORA: (/(?<!<[^>]*)([^<>]*)/)

    let rawHtml = this.props.editorHtml
      .replace(
        /( )(?![^<]*>|[^<>]*<( ))/g,
        '<span class="u-invisible-char u-invisible-char--big">\u00B7</span>'
      )
      .replace(/(<\/p>)/g, '<span class="u-invisible-char">\u00B6</span></p>')
      .replace(/(<\/h1>)/g, '<span class="u-invisible-char">\u00B6</span></h1>')
      .replace(
        /(<\/h2>)/g,
        '<span class="u-invisible-char">\u00B6</span></h2>'
      );

    return (
      <div className="text-editor">
        <CustomToolbar
          onToggleAllChars={this.handleClickToggleAllChars}
          isAllCharsActive={this.state.isAllCharsActive}
        />
        <ReactQuill
          onChange={this.props.onChange}
          onKeyDown={this.handleKeyDown}
          placeholder={this.props.placeholder}
          modules={Editor.modules}
          formats={Editor.formats}
          theme={'snow'}
          style={{
            display: !this.state.isAllCharsActive ? 'block' : 'none'
          }}
          defaultValue={this.props.valorDefault}
          readOnly={this.props.readOnly}
          idQuarto={this.props.idQuarto}
          listaAutoTextos={this.props.listaAutoTextos}
          ref={this._editor}
        />
        <div
          className="ql-editor"
          style={{
            display: this.state.isAllCharsActive ? 'block' : 'none'
          }}
          dangerouslySetInnerHTML={{
            __html: rawHtml
          }}
        />
      </div>
    );
  }
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
  history: {
    delay: 2500,
    userOnly: true
  },
  toolbar: {
    container: '#toolbar',
    handlers: {
      undo,
      redo,

      copy,
      cut,
      clipboardHtml,
      clipboardRaw
    }
  },
  clipboard: {
    matchVisual: false
  }
};

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
  'align',
  'script',
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color'
];

/*
 * PropType validation
 */
Editor.propTypes = {
  placeholder: PropTypes.string
};

export default Editor;
