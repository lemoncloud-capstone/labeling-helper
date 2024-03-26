import React from 'react';

import './EditorView.scss';
import classNames from 'classnames';
import { connect } from 'react-redux';

import EditorContainer from './EditorContainer/EditorContainer';
import TopNavigationBar from './TopNavigationBar/TopNavigationBar';
import { PopupWindowType } from '../../data/enums/PopupWindowType';
import { AppState } from '../../store';

interface IProps {
    activePopupType: PopupWindowType;
}

const EditorView: React.FC<IProps> = ({ activePopupType }) => {
    const getClassName = () => {
        return classNames('EditorView', {
            withPopup: !!activePopupType,
        });
    };

    return (
        <div className={getClassName()} draggable={false}>
            <TopNavigationBar />
            <EditorContainer />
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    activePopupType: state.general.activePopupType,
});

export default connect(mapStateToProps)(EditorView);
