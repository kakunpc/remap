import { connect } from 'react-redux';
import Keyboards from './Keyboards';
import { RootState } from '../../../store/state';
import { AppActions, KeyboardsActions } from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  return {
    keyboard: state.entities.keyboard,
    layerCount: state.entities.device.layerCount,
    selectedLayer: state.configure.keyboards.selectedLayer,
    selectedKeyboardOptions: state.configure.layoutOptions.selectedOptions,
    remaps: state.app.remaps,
    keymaps: state.entities.device.keymaps,
    keyboardKeymap: state.entities.keyboardDefinition?.layouts.keymap,
    keyboardLabels: state.entities.keyboardDefinition?.layouts.labels,
  };
};
export type KeyboardsStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickLayerNumber: (layer: number) => {
      _dispatch(KeyboardsActions.clearSelectedPos());
      _dispatch(KeyboardsActions.updateSelectedLayer(layer));
    },
    setKeyboardSize: (width: number, height: number) => {
      _dispatch(AppActions.updateKeyboardSize(width, height));
    },
  };
};

export type KeyboardsActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Keyboards);
