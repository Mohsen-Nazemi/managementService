from face_verification.app import Authentication, ConfigManager, start_process, start_process_test


def load_model():
    global authenticator
    global config_manager

    authenticator = Authentication()
    authenticator.load_models()

    config_manager = ConfigManager()

def start():
    start_process_test(authenticator, config_manager)
