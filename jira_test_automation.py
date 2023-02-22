import requests


# Request Create Version
# class JiraTask:
#     def __init__(self) -> None:
#         pass

# def createVersion():
#     myData = {}
#     myData["gameVersion"] = '7.3.0db'
#     myData["user_name"] = "anh.nguyenviet6"
#     myobj = myData

#     url = 'https://jira.gameloft.org/rest/cb-automation/latest/hooks/11ab6d4646e1a816c474ff572518a7b3fd2c7084'
#     x = requests.post(url, json = myobj)
#     print(x.text)

# def createJiraTask():
#     myData = {}
#     myData["summary"] = 'summaryyyyy'
#     myData["priority"] = ''
#     myData["desc"] = 'dessccccc'
#     myData["assignee"] = ''

#     url = 'https://jira.gameloft.org/rest/cb-automation/latest/hooks/75915f779de2120297ca4c19fdb660dd8e4832f4'
#     x = requests.post(url, json = myData)
#     print(x.text)

# createVersion()
# createJiraTask()

import requests
myData = {}
myData["gameVersion"] = '7.3.0cb'
myData["user_name"] = "anh.nguyenviet6"

url = 'https://jira.gameloft.org/rest/cb-automation/latest/hooks/90829df43af72bc27de506fee71f74d956cc3a47'
x = requests.post(url, json = myData)