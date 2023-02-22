import schedule
import time
import requests
import sys

def jobSevenAM():
    print("Job is running at 7:30 every day!")
    import os
    # os.system('python z_test.py send_msg')    
    url = 'http://127.0.0.1:3000/doTask'
    data = {}
    data["text"] = "Raven Daily Remind"
    data["user_name"] = "anh.nguyenviet6"
    myobj = data    
    x = requests.post(url, json = myobj)  
    print(x.text)

def jobSvenPM():
    print("Job is running at 17:40 every day!")
    data = {}
    data["text"] = "Raven Thank"
    data["user_name"] = "anh.nguyenviet6"
    myobj = data    
    url = 'http://127.0.0.1:3000/doTask'
    myobj = {'name': "anh.nguyenviet6@gameloft.com"}      
    x = requests.post(url, json = myobj) 
    print(x.text)

schedule.every().day.at("07:30").do(jobSevenAM)
schedule.every().day.at("18:00").do(jobSvenPM)

while True:
    schedule.run_pending()
    time.sleep(1)
