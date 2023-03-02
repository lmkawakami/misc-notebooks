from flask import Flask
from aws_xray_sdk.core import xray_recorder, patch
from aws_xray_sdk.ext.flask.middleware import XRayMiddleware
import requests
from flask import request, Response

patch(['requests'])

APP_NAME = "app_1"
NEXT_APP = "app_2"

app = Flask(__name__)

xray_recorder.configure(service = APP_NAME)
plugins = ("ECSPlugin",)
xray_recorder.configure(plugins=plugins)
XRayMiddleware(app, xray_recorder)

apps_ports = {
    "app_1": 8001,
    "app_2": 8002,
    "app_3": 8003,
    "spy_server": 8004
}

# @app.before_request
# def before_request_func():
#     print("\n\n\n\n\n\n")
#     print("--------------------------------")
#     print("------- request started --------")
#     print("--------------------------------")

# @app.after_request
# def after_request_func(response):
#     print("--------------------------------")
#     print("-------- request ended ---------")
#     print("--------------------------------")
#     print("\n\n\n\n\n\n")

@app.route("/<_route>")
def handle(_route):
    print(f"🔴🟢 {APP_NAME} called!!!!  endpoint: {_route}   method: {request.method}")
    document = xray_recorder.current_segment()
    trace_id = document.trace_id
    print(f"🟡current trace id: {trace_id}")
    print(f"🟡header trace id: {request.headers.get('X-Amzn-Trace-Id')}")
    print(request_it())

    resp = Response(APP_NAME)
    for key in apps_ports.keys():
        resp.headers[f'Trace_Id_{key}'] = request.headers.get(f'Trace_Id_{key}')
    resp.headers[f'Trace_Id_{APP_NAME}'] = document.trace_id
    return resp

def main():
    port = apps_ports[APP_NAME]
    print("Serving flask app on port", port)
    # while True:
    app.run("0.0.0.0", port)

def request_it():
    next_app_port = apps_ports[NEXT_APP]
    url = f"http://localhost:{next_app_port}/{NEXT_APP}"
    headers = {"head": "shoulder"}
    resp = requests.get(url, headers=headers, verify=False)
    return resp.text

if __name__ == "__main__":
    main()