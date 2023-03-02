from flask import Flask
from aws_xray_sdk.core import xray_recorder, patch
from aws_xray_sdk.ext.flask.middleware import XRayMiddleware

import requests
patch(['requests'])

app = Flask(__name__)

xray_recorder.configure(service = "test_app")
plugins = ("ECSPlugin",)
xray_recorder.configure(plugins=plugins)
XRayMiddleware(app, xray_recorder)

@app.route("/")
def hello_world():
    print("🔴🟢Helo!!!!")
    document = xray_recorder.current_segment()
    trace_id = document.trace_id
    print(trace_id)
    print(request())
    return "<p>Hello, World!</p>"

def main():
    port = 8009
    print("Serving flask app on port", port)
    # while True:
    app.run("0.0.0.0", port)

def request():
    url = "http://localhost:8080"
    body = {"key": "value"}
    headers = {"head": "shoulder"}

    resp = requests.post(url, data=body, headers=headers)
    return resp.text

if __name__ == "__main__":
    main()