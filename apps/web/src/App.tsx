import React from 'react';

import './App.scss';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { ProjectType } from './data/enums/ProjectType';
import { ISize } from './interfaces/ISize';
import { Settings } from './settings/Settings';
import { PlatformModel } from './staticModels/PlatformModel';
import { AppState } from './store';
import { RoboflowAPIDetails } from './store/ai/types';
import EditorView from './views/EditorView/EditorView';
import MainView from './views/MainView/MainView';
import MobileMainView from './views/MobileMainView/MobileMainView';
import NotificationsView from './views/NotificationsView/NotificationsView';
import PopupView from './views/PopupView/PopupView';
import { SizeItUpView } from './views/SizeItUpView/SizeItUpView';

interface IProps {
    projectType: ProjectType;
    windowSize: ISize;
    isObjectDetectorLoaded: boolean;
    isPoseDetectionLoaded: boolean;
    isYOLOV5ObjectDetectorLoaded: boolean;
    roboflowAPIDetails: RoboflowAPIDetails;
}

const App: React.FC<IProps> = ({
    projectType,
    windowSize,
    isObjectDetectorLoaded,
    isPoseDetectionLoaded,
    isYOLOV5ObjectDetectorLoaded,
    roboflowAPIDetails,
}) => {
    const selectRoute = () => {
        if (!!PlatformModel.mobileDeviceData.manufacturer && !!PlatformModel.mobileDeviceData.os)
            return <MobileMainView />;
        if (!projectType) return <MainView />;
        else {
            if (windowSize.height < Settings.EDITOR_MIN_HEIGHT || windowSize.width < Settings.EDITOR_MIN_WIDTH) {
                return <SizeItUpView />;
            } else {
                return <EditorView />;
            }
        }
    };
    const isAILoaded =
        isObjectDetectorLoaded ||
        isPoseDetectionLoaded ||
        isYOLOV5ObjectDetectorLoaded ||
        (roboflowAPIDetails.model !== '' && roboflowAPIDetails.key !== '' && roboflowAPIDetails.status);

    return (
        <div className={classNames('App', { AI: isAILoaded })} draggable={false}>
            {selectRoute()}
            <PopupView />
            <NotificationsView />
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    projectType: state.general.projectData.type,
    windowSize: state.general.windowSize,
    isSSDObjectDetectorLoaded: state.ai.isSSDObjectDetectorLoaded,
    isPoseDetectorLoaded: state.ai.isPoseDetectorLoaded,
    isYOLOV5ObjectDetectorLoaded: state.ai.isYOLOV5ObjectDetectorLoaded,
    roboflowAPIDetails: state.ai.roboflowAPIDetails,
});

export default connect(mapStateToProps)(App);