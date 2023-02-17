import requests
import sys
import json

url = ""
my_text = ""
myobj = {}

url = 'http://127.0.0.1:3000/doHelp'

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
elif sys.argv[1] == 'doRemind':
    data = {}
    data["text"] = "Raven Daily Remind"
    data["user_name"] = "anh.nguyenviet6"
    myobj = data
elif sys.argv[1] == 'doThank':
    data = {}
    data["text"] = "Raven Thank"
    data["user_name"] = "anh.nguyenviet6"
    myobj = data
elif sys.argv[1] == 'sendBuildToQA':
    data = {}
    data["text"] = 'Giúp tôi gửi thông tin build này tới các bạn QAs, một cách lịch sự\nVersion build: 7.3.0ab \nLink Base Sharefolder: \\gameloft.org\han\Production\DMLCN\1. Android China\40. UPD63\2. Release\7.3.0ab\7.3.0ab base build to test Tracking CRM \nLink Repack Sharefolder: \\gameloft.org\han\Production\DMLCN\1. Android China\40. UPD63\2. Release\7.3.0ab\channel_apks_beta\ \nLink Base: https://glplay.gameloft.com/57/build/562526\nLink Channel: https://glplay.gameloft.com/57/build/562528'
    data["user_name"] = "anh.nguyenviet6"
    myobj = data
elif sys.argv[1] == 'doHelp':
    data = {}
    data["text"] = 'Raven Help'
    data["user_name"] = "anh.nguyenviet6"
    myobj = data

elif sys.argv[1] == 'doCreateVersion':
    data = {}
    # data["text"] = 'Raven-jira: create\ngame_version:7.3.0eb\nepic_link:DMLCNQA-1651'
    data["text"] = 'Raven-Jira: create tasks for the data\n```\ngame_version:7.3.0cb\nepic_link:DMLCNQA-165\n```'
    data["user_name"] = "anh.nguyenviet6"
    myobj = data
    url = 'http://127.0.0.1:3000/doTask'


x = requests.post(url, json = myobj)


print(x.text)
