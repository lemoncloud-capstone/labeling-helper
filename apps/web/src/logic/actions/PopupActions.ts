import { store } from '../../main';
import { updateActivePopupType } from '../../store/general/actionCreators';
import { ContextManager } from '../context/ContextManager';

export class PopupActions {
    public static close() {
        store.dispatch(updateActivePopupType(null));
        ContextManager.restoreCtx();
    }
}
