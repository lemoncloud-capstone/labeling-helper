import * as posenet from '@tensorflow-models/posenet';
import { PoseNet } from '@tensorflow-models/posenet';
import { Pose } from '@tensorflow-models/posenet';

import { LabelType } from '../data/enums/LabelType';
import { Notification } from '../data/enums/Notification';
import { NotificationsDataMap } from '../data/info/NotificationsData';
import { AIPoseDetectionActions } from '../logic/actions/AIPoseDetectionActions';
import { store } from '../main';
import { updatePoseDetectorStatus } from '../store/ai/actionCreators';
import { updateActiveLabelType } from '../store/labels/actionCreators';
import { submitNewNotification } from '../store/notifications/actionCreators';
import { LabelsSelector } from '../store/selectors/LabelsSelector';
import { NotificationUtil } from '../utils/NotificationUtil';

export class PoseDetector {
    private static model: PoseNet;

    public static loadModel(callback?: () => unknown) {
        posenet
            .load({
                architecture: 'ResNet50',
                outputStride: 32,
                inputResolution: 257,
                quantBytes: 2,
            })
            .then((model: PoseNet) => {
                PoseDetector.model = model;
                store.dispatch(updatePoseDetectorStatus(true));
                store.dispatch(updateActiveLabelType(LabelType.POINT));
                const activeLabelType: LabelType = LabelsSelector.getActiveLabelType();
                if (activeLabelType === LabelType.POINT) {
                    AIPoseDetectionActions.detectPoseForActiveImage();
                }
                if (callback) {
                    callback();
                }
            })
            .catch(error => {
                // TODO: Introduce central logging system like Sentry
                store.dispatch(
                    submitNewNotification(
                        NotificationUtil.createErrorNotification(
                            NotificationsDataMap[Notification.MODEL_DOWNLOAD_ERROR]
                        )
                    )
                );
            });
    }

    public static predict(image: HTMLImageElement, callback?: (predictions: Pose[]) => unknown) {
        if (!PoseDetector.model) return;

        PoseDetector.model
            .estimateMultiplePoses(image)
            .then((predictions: Pose[]) => {
                if (callback) {
                    callback(predictions);
                }
            })
            .catch(error => {
                // TODO: Introduce central logging system like Sentry
                store.dispatch(
                    submitNewNotification(
                        NotificationUtil.createErrorNotification(
                            NotificationsDataMap[Notification.MODEL_INFERENCE_ERROR]
                        )
                    )
                );
            });
    }
}
