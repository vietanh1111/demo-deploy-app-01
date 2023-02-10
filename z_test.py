import requests
import sys
import json

url = ""
my_text = ""
myobj = {}

if sys.argv[1] == 'doReport':
    print(sys.argv[1])
    data = {}
    data["text"] = "Reporting for anh.nguyenviet6@gameloft.com:\n- Update UC and 333 SDK"
    data["user_name"] = "anh.nguyenviet6"
    myobj = data
elif sys.argv[1] == 'doShowReport':
    data = {}
    data["text"] = "Raven Show Reports"
    data["user_name"] = "anh.nguyenviet6"
    myobj = data
elif sys.argv[1] == 'doShowScore':
    data = {}
    data["text"] = "Raven Show Score"
    data["user_name"] = "anh.nguyenviet6"
    myobj = data
elif sys.argv[1] == 'doShowReport':
    data = {}
    data["text"] = "Raven Show Reports"
    data["user_name"] = "anh.nguyenviet6"
    myobj = data

url = 'http://127.0.0.1:3000/doTask'
x = requests.post(url, json = myobj)


print(x.text)
