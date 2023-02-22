import os
import openai
import json

openai.api_key = "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"

conversation = {}
sumup_conversation = ""

i = 0

while True:

    msg = input("input ")

    print("msg=" + msg)
    # Please sum up the conversation

    if i == 1:
        pass
    
    question_1 = sumup_conversation + ". " + msg
    print("question_1=" + question_1)
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=question_1,
        max_tokens=500,
        temperature=0.1
    )

    answer = response.choices[0].text
    print(answer)

    conversation["Me"] = msg
    conversation["You"] = answer

    print(conversation)


    question2 = "Please remember name and sum up the information in the json data: " + json.dumps(conversation)
    print("question2=" + question2)
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=question2,
        max_tokens=500,
        temperature=0.1
    )

    sumup_conversation = response.choices[0].text
    print(sumup_conversation)

    i = i + 1
