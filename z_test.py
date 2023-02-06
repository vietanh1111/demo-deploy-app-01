import requests
import sys

url = ""
my_text = ""
myobj = {}
    # url2= 'https://chat.gameloft.org/hooks/zgzs61kbmtbiuradjy6ut6oi8a'
    # myobj2 = {'text': "Khả năng cao con quạ không ai cứu nổi, trong thời gian chờ đợi, anh em report tạm vào thread tương ứng cho mỗi ngày nha\n## Report 2022-02-01"}

if sys.argv[1] == 'report':
    print(sys.argv[1])
    my_text = 'Reporting for anh.nguyenviet6@gameloft.com:\n- Update UC and 4399 SDK\n- Research about modified profile.'
    url = 'http://127.0.0.1:3000/report'
    myobj = {'text': my_text}    

elif sys.argv[1] == 'get_reports':
    print(sys.argv[1])
    url = 'http://127.0.0.1:3000/numOfReport'
    myobj = {'name': "anh.nguyenviet6@gameloft.com"}

elif sys.argv[1] == 'send_msg':
    print(sys.argv[1])
    url = 'http://127.0.0.1:3000/sendMsg'
    myobj = {'name': "anh.nguyenviet6@gameloft.com"}   

elif sys.argv[1] == 'check_records':
    print(sys.argv[1])
    url = 'http://127.0.0.1:3000/checkMemberMissingRecord'
    myobj = {'name': "anh.nguyenviet6@gameloft.com"}   

elif sys.argv[1] == 'chat':
    print(sys.argv[1])
    url = 'http://127.0.0.1:3000/chatToVietanh'
    myobj = {'text': "Question: Do you know my name?"}   
    # myobj = {'text': "Question: Hi, Im Vietanh"}   

x = requests.post(url, json = myobj)
# # x2 = requests.post(url2, json = myobj2)
# x3 = requests.post(url3, json = myobj3)

# # print(x.text)
# # print(x2.text)cls
