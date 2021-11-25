import os
import importlib
from inspect import getmembers, isfunction

import socketio
from flask import Flask

sio = socketio.Server(async_mode=None)
app = Flask(__name__)
app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app)


@sio.on('connect')
def test_connect(sid, environ):
    sio.emit('my_response', {'data': 'Connected', 'count': 0}, room=sid)


@sio.on('disconnect')
def test_disconnect(sid):
    print('Client disconnected')


# Module auto importer
modules_in_dir = os.listdir(os.path.dirname(os.path.abspath(__file__)))
for module in modules_in_dir:
    if module == '__init__.py' or module == 'coordinator.py' or module[-3:] != '.py':
        continue
    globals()[module[:-3]] = importlib.import_module(module[:-3])

    if hasattr(globals()[module[:-3]], 'load_model'):
        globals()[module[:-3]].load_model()


def send_modules_and_functions_list():
    list = {}

    for module in modules_in_dir:
        if module == '__init__.py' or module == 'coordinator.py' or module[-3:] != '.py':
            continue

        list[module[:-3]] = {}
        for function in getmembers(globals()[module[:-3]], isfunction):
            list[module[:-3]][function[0]] = {}

    return list


@sio.on('module and functions request')
def module_and_functions(sid, environ):
    sio.emit("modules and functions list", send_modules_and_functions_list())


def start_def(data, script):
    for function in getmembers(globals()[script], isfunction):
        if data['functionName'] == function[0]:
            if 'data' in data and len(data['data']['query']) > 0 or data['data']['body']:
                return sio.emit('response|' + data['request_id'], function[1](data['data']))
            else:
                res = function[1]()
                # return await sio.emit('response|' + data['request_id'], await function[1]())
                emit_res = sio.emit('response|' + data['request_id'], res)
                return emit_res


# Socket on Run event
@sio.on('run')
def run_function(sid, data):
    for module in globals():
        if data['scriptName'] == module:
            try:
                res = start_def(data, module)
                print(res)
            except Exception as e:
                print(e)
                sio.emit('response', False)
                break
            else:
                break

    # Emit false if function or file not found
    # return await sio.emit('response', False)


if __name__ == '__main__':
    if sio.async_mode == 'threading':
        app.run(threaded=True)
    elif sio.async_mode == 'eventlet':
        import eventlet
        import eventlet.wsgi
        eventlet.wsgi.server(eventlet.listen(('', 5000)), app)
    elif sio.async_mode == 'gevent':
        from gevent import pywsgi
        try:
            from geventwebsocket.handler import WebSocketHandler
            websocket = True
        except ImportError:
            websocket = False
        if websocket:
            pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler).serve_forever()
        else:
            pywsgi.WSGIServer(('', 5000), app).serve_forever()
    elif sio.async_mode == 'gevent_uwsgi':
        print('Start the application through the uwsgi server. Example:')
        print('uwsgi --http :5000 --gevent 1000 --http-websockets --master '
              '--wsgi-file latency.py --callable app')
    else:
        print('Unknown async_mode: ' + sio.async_mode)
