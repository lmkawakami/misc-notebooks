import requests
# from aws_xray_sdk.core import xray_recorder
# from aws_xray_sdk.core import patch
# patch([requests])

url = "http://localhost:8080"
body = {
    "fizz": "buzz"
}
headers = {
    "john": "doe"
}
resp = requests.post(url, data=body, headers=headers)
print(resp.text)
