import requests
import csv
from collections import defaultdict
from decouple import config

url = config('HASURA_REST_API_URL')
headers = {"x-hasura-admin-secret": config('HASURA_ADMIN_SECRET'),
           "Content-Type": "application/json"}

with open("input/ScheduleData.csv", 'r') as file:
    csvreader = csv.reader(file)
    for row in csvreader:
        requestBody = {
            "query": "mutation ($object: [assessment_schedule_insert_input!] = {}) {\n      insert_assessment_schedule(objects: $object) {\n        returning {\n          id\n           }\n      }\n    }",
            "variables": {
                "object": {
                    "institute_id": row[0],
                    "date": row[1],
                    "user_id": row[2],
                    "username": row[3]
                }
            }
        }
        x = requests.post(url, headers=headers, json=requestBody)
        print(x)
