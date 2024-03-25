import { ContextManager } from '../context/ContextManager';
import { store } from '../../main';
import { updateActivePopupType } from '../../store/general/actionCreators';

export class PopupActions {
    public static close() {
        store.dispatch(updateActivePopupType(null));
        ContextManager.restoreCtx();
    }
}
