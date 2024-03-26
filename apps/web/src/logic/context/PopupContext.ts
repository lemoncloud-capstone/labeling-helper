import { BaseContext } from './BaseContext';
import { PopupWindowType } from '../../data/enums/PopupWindowType';
import { HotKeyAction } from '../../data/HotKeyAction';
import { Settings } from '../../settings/Settings';
import { GeneralSelector } from '../../store/selectors/GeneralSelector';
import { PopupActions } from '../actions/PopupActions';

export class PopupContext extends BaseContext {
    public static actions: HotKeyAction[] = [
        {
            keyCombo: ['Escape'],
            action: (event: KeyboardEvent) => {
                const popupType: PopupWindowType = GeneralSelector.getActivePopupType();
                const canBeClosed: boolean = Settings.CLOSEABLE_POPUPS.includes(popupType);
                if (canBeClosed) {
                    PopupActions.close();
                }
            },
        },
    ];
}
