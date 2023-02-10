import requests
import sys
import json

url = ""
my_text = ""
myobj = {}
    # url2= 'https://chat.gameloft.org/hooks/zgzs61kbmtbiuradjy6ut6oi8a'
    # myobj2 = {'text': "Khả năng cao con quạ không ai cứu nổi, trong thời gian chờ đợi, anh em report tạm vào thread tương ứng cho mỗi ngày nha\n## Report 2022-02-01"}

if sys.argv[1] == 'doReport':
    print(sys.argv[1])
    data = {}
    data["text"] = "Reporting for anh.nguyenviet6@gameloft.com:\n- Update UC and 333 SDK"
    data["user_name"] = "anh.nguyenviet6"
    myobj = data
elif sys.argv[1] == 'doShowReport':
    x = '{ "text":"Raven Show Reports"}'
    myobj = x



url = 'http://127.0.0.1:3000/doTask'
x = requests.post(url, json = myobj)
# # x2 = requests.post(url2, json = myobj2)
# x3 = requests.post(url3, json = myobj3)

print(x.text)
# # print(x2.text)cls
