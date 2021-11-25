from object_detection.app import load_models, start_process
import os


def load_model():
    global model
    model = load_models(
        os.path.dirname(
            os.path.abspath(__file__)) + '/object_detection/model_weights/model_weights_best_accuracy_0121.h5',
        os.path.dirname(os.path.abspath(__file__)) + '/object_detection/prior_boxes_my_model_32085_relative.pkl',
        os.path.dirname(os.path.abspath(__file__)) + '/object_detection/object_names_coco.pkl')


def start():
    start_process(
        os.path.dirname(os.path.abspath(__file__)) + '/object_detection/part_video.mp4',
        os.path.dirname(os.path.abspath(__file__)) + '/object_detection/part_video_out.mp4',
        model[0], model[1], model[2])

    return "ok"
