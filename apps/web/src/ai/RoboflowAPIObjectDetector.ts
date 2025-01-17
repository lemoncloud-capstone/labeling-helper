import axios from 'axios';

import { LabelType } from '../data/enums/LabelType';
import { store } from '../main';
import { updateRoboflowAPIDetails } from '../store/ai/actionCreators';
import { RoboflowAPIDetails } from '../store/ai/types';
import { updateActiveLabelType } from '../store/labels/actionCreators';
import { ImageData } from '../store/labels/types';
import { AISelector } from '../store/selectors/AISelector';
import { LabelsSelector } from '../store/selectors/LabelsSelector';
import { FileUtil } from '../utils/FileUtil';

interface RoboflowPrediction {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    class: string;
}

export interface DetectedObject {
    x: number;
    y: number;
    width: number;
    height: number;
    score: number;
    class: string;
}

export class RoboflowAPIObjectDetector {
    public static loadModel(roboflowAPIDetails: RoboflowAPIDetails, onSuccess?: () => any, onFailure?: () => any) {
        store.dispatch(updateRoboflowAPIDetails(roboflowAPIDetails));
        store.dispatch(updateActiveLabelType(LabelType.RECT));
        const activeLabelType: LabelType = LabelsSelector.getActiveLabelType();
        if (activeLabelType === LabelType.RECT) {
            const activeImageData: ImageData = LabelsSelector.getActiveImageData();

            const wrappedOnFailure = () => {
                store.dispatch(updateRoboflowAPIDetails({ status: false, model: '', key: '' }));
                onFailure();
            };

            RoboflowAPIObjectDetector.predict(activeImageData, onSuccess, wrappedOnFailure);
        }
    }

    public static predict(
        imageData: ImageData,
        onSuccess?: (predictions: DetectedObject[]) => any,
        onFailure?: () => any
    ) {
        const roboflowAPIDetails: RoboflowAPIDetails = AISelector.getRoboflowAPIDetails();
        FileUtil.loadImageBase64(imageData.fileData).then(data => {
            axios({
                method: 'POST',
                url: 'https://detect.roboflow.com/' + roboflowAPIDetails.model,
                params: {
                    api_key: roboflowAPIDetails.key,
                },
                data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
                .then(response => {
                    const predictions: DetectedObject[] = (response.data.predictions as RoboflowPrediction[]).map(
                        (prediction: RoboflowPrediction) => {
                            return {
                                x: prediction.x - prediction.width / 2,
                                y: prediction.y - prediction.height / 2,
                                width: prediction.width,
                                height: prediction.height,
                                score: prediction.confidence,
                                class: prediction.class,
                            };
                        }
                    );
                    onSuccess(predictions);
                })
                .catch(onFailure);
        });
    }
}
