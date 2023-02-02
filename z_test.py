import requests
 
my_text = 'Reporting for @anh.nguyenviet6:\n- Check google play services and firebase service with BEI team\n- Do research Unity for China Store following iOS team.\n- Non-project: working on android studio premake with the gameloft libs(cont)'
my_text2 = 'Reporting for @duc.luutrong \n- Implement script notify when upload dSyms\n- Learning Unity'
url = 'http://127.0.0.1:3000/sayHello'
myobj = {'text': my_text2}

url2= 'https://chat.gameloft.org/hooks/zgzs61kbmtbiuradjy6ut6oi8a'
myobj2 = {'text': "Khả năng cao con quạ không ai cứu nổi, trong thời gian chờ đợi, anh em report tạm vào thread tương ứng cho mỗi ngày nha\n## Report 2022-02-01"}

x = requests.post(url, json = myobj)
# x2 = requests.post(url2, json = myobj2)

print(x.text)
# print(x2.text)cls
