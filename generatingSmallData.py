import pandas as pd
import json 

data = pd.read_csv("https://res.cloudinary.com/dp6tqc0bs/raw/upload/v1668348259/HackYourWay_-_Experimental_Data_-_Sheet1_dnsjlq.csv")
data.sort_values(by=['HouseNo'])

def createSmallData(houseNo):
  smallData = data[data['HouseNo']==houseNo]
  smallData = smallData[['Name','FatherName','MotherName','HusbandName']]
  return smallData

def convertToJSON(smallData):
  finalString = smallData.to_json(orient="split")
  parsed = json.loads(finalString)
  json.dumps(parsed, indent=4)
  return finalString 

houseNo = input("Enter House Number")
smallData = createSmallData(houseNo)
jsonStr = convertToJSON(smallData)
jsonStr