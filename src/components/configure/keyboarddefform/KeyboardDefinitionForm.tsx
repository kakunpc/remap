import { ContactsOutlined } from '@material-ui/icons';
import React from 'react';
import {
  KeyboardDefinitionFormActionsType,
  KeyboardDefinitionFormStateType,
} from './KeyboardDefinitionForm.container';
import './KeyboardDefinitionForm.scss';

type OwnProps = {};
type KeyboardDefinitionFormProps = OwnProps &
  Partial<KeyboardDefinitionFormStateType> &
  Partial<KeyboardDefinitionFormActionsType>;

export default class KeyboardDefinitionForm extends React.Component<
  KeyboardDefinitionFormProps,
  {}
> {
  constructor(
    props: KeyboardDefinitionFormProps | Readonly<KeyboardDefinitionFormProps>
  ) {
    super(props);
  }

  onDropFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length !== 1) {
      return;
    }
    const file = files[0];
    if (!file.type.endsWith('/json')) {
      return;
    }
    this.props.onDropFile!(file);
  };

  onDragOverFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    this.props.onDragOverFile!();
  };

  onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    if (!files || files.length !== 1) {
      return;
    }
    const file = files[0];
    if (!file.type.endsWith('/json')) {
      return;
    }
    this.props.onDropFile!(file);
    event.target.value = '';
  };

  render() {
    return (
      <div className="keyboarddefinitionform-wrapper">
        <div className="message">
          Please upload your JSON file of this keyboard definition from local.
        </div>
        <div className="upload-form">
          <div
            className={
              this.props.dragging
                ? 'drop-target drop-target-active'
                : 'drop-target'
            }
            onDragOver={this.onDragOverFile}
            onDrop={this.onDropFile}
            onDragLeave={this.props.onDragLeaveFile!.bind(this)}
          >
            <div className="place-holder">Drop here.</div>
          </div>
          <input type="file" onChange={this.onChangeFile} />
        </div>
      </div>
    );
  }
}