import requests
import csv
from collections import defaultdict
from decouple import config

assessorCodeToPhone = {}
assessorPhoneToId = {}

# Assessor code <> Phone number
# columns needed: code, phonenumber
with open("input/scheduling/CodePhonenumberMapping.csv", 'r') as file:
    csvreader = csv.reader(file)
    for row in csvreader:
        assessorCodeToPhone[row[0]] = row[1]


# Assessor Phone <> User ID
# columns needed: phone, userid
with open("input/scheduling/PhonenumberUserIdMapping.csv", 'r') as file:
    csvreader = csv.reader(file)
    for row in csvreader:
        assessorPhoneToId[row[0]] = row[1]

url = config('HASURA_REST_API_URL')
headers = {"x-hasura-admin-secret": config('HASURA_ADMIN_SECRET'),
           "Content-Type": "application/json"}

for key, value in assessorCodeToPhone.items():
    accessorId = assessorPhoneToId.get(value)

    if not accessorId:
        raise Exception("No userId found for assessor code: " +
                        key + " and phonenumber: "+value)

    requestBody = {
        "query": "mutation ($object: [assessors_insert_input!] = {}) {\n      insert_assessors(objects: $object) {\n        returning {\n          code\n           }\n      }\n    }",
        "variables": {
            "object": {
                "code": key,
                "phonenumber": value,
                "user_id": accessorId
            }
        }
    }
    print("Inserting "+key+", "+value)
    insertUserRequest = requests.post(url, headers=headers, json=requestBody)
    print(insertUserRequest)


with open("input/scheduling/AssessmentSchedule.csv", 'r') as file:
    csvreader = csv.reader(file)
    for row in csvreader:
        requestBody = {
            "query": "mutation ($object: [assessment_schedule_insert_input!] = {}) {\n      insert_assessment_schedule(objects: $object) {\n        returning {\n          id\n           }\n      }\n    }",
            "variables": {
                "object": {
                    "institute_id": row[1],
                    "date": row[2],
                    "assessor_code": row[0]
                }
            }
        }
        print("Uploading schedule for " +
              row[1] + " on "+row[2]+" by "+row[0])
        insertAssessmentScheduleRequest = requests.post(
            url, headers=headers, json=requestBody)
        print(insertAssessmentScheduleRequest)
