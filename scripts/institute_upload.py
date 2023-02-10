import requests
import csv
from collections import defaultdict
from decouple import config

institutes = {}
institute_courses = defaultdict(set)
institute_poc = {}
institute_specialization = defaultdict(set)
institute_type = defaultdict(set)

testLatitude = 19.0760
testLongitude = 72.8777

with open("input/Institute_Details.csv", 'r') as file:
    csvreader = csv.reader(file)
    for row in csvreader:
        institudeId = row[1]
        institutes[institudeId] = {
            "district": row[0],
            "latitude": testLatitude,
            "longitude": testLongitude,
            "name": row[2],
            "sector": row[8],
            "email": row[13],
        }
        institute_courses[institudeId].add(row[5])
        institute_poc[institudeId] = {
            "name": row[9],
            "number": row[10]
        }
        institute_specialization[institudeId].add(row[3])
        institute_type[institudeId].add(row[4])

url = config('HASURA_REST_API_URL')
headers = {"x-hasura-admin-secret": config('HASURA_ADMIN_SECRET'),
           "Content-Type": "application/json"}

for key, value in institutes.items():
    requestBody = {
        "query": "mutation ($object: [institutes_insert_input!] = {}) {\n      insert_institutes(objects: $object) {\n        returning {\n          id\n           }\n      }\n    }",
        "variables": {
            "object": {
                "id": key,
                "district": value["district"],
                "latitude": value["latitude"],
                "longitude": value["longitude"],
                "name": value["name"],
                "sector": value["sector"],
                "email": value["email"],
                "institute_courses": {
                    "data": {
                        "courses": "{" + ", ".join(institute_courses[key]) + "}"
                    }
                },
                "institute_specializations": {
                    "data": {
                        "specializations": "{" + ", ".join(institute_specialization[key]) + "}"
                    }
                },
                "institute_types": {
                    "data": {
                        "types": "{" + ", ".join(institute_type[key]) + "}"
                    }
                },
                "institute_pocs": {
                    "data": {
                        "name": institute_poc[key]["name"],
                        "number":  institute_poc[key]["number"]
                    }
                }
            }
        }
    }

    x = requests.post(url, headers=headers, json=requestBody)
    print(x)