import os


from spoof_detection.app_liveness import load_models, start_process


def load_model():
    global model
    model = load_models(
        os.path.dirname(os.path.abspath(__file__)) + '/spoof_detection/liveness_model/resnet50_best_spoof_model_320i.h5'
    )


def start():
    json_output = start_process(os.path.dirname(os.path.abspath(__file__)) + '/spoof_detection/testVideo.mp4', model)
    print(json_output)
    return "Its OK"
