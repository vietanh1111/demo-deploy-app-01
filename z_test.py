import requests

x = requests.get('https://w3schools.com')
print(x.status_code)