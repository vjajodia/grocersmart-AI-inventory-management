import time 
from flask import Flask, request
import json
import pickle
import numpy as np
app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/getChartDetails')
def get_chart():
    return {"data": [
      ['Time','122095', '123347', '129635',{'role': 'annotation' } ],
      ['Week 1', 10, 24, 20, ''],
      ['Week 2', 16, 22, 23,''],
      ['Week 3', 28, 19, 29,''],
      ['Week 4', 28, 19, 29,''],
      ['Week 5', 18, 19, 29,''],
      ['Week 6', 28, 49, 29,''],
      ['Week 7', 48, 19, 69,''],
      ['Week 8', 8, 43, 77,'']
    ]}

@app.route('/getcategoryBasedOnOutletIdentifier',methods=['POST'])
def get_Outlet_Identifier():
    f = open('data/train.json',encoding='utf-8-sig')
    data = json.load(f)
    a = []
    for i in data:
        if i['Outlet_Identifier'] == request.json['outlet']:
            a.append(i['Item_Type'])        
    a = list(set(a)) 
    a.sort()
    f.close()
    return {
        "data" : a
    }
def sortFunction(value):
	return value["sales"]
@app.route('/getitemnoBasedOnCategory',methods=['POST'])
def get_Item_Type():
    f = open('data/train.json',encoding='utf-8-sig')
    data = json.load(f)
    a = []
    
    b = []
    c = []
    for i in data:
        salesArray = {}
        if i['Item_Type'] == request.json['category'] and i['Outlet_Identifier'] == request.json['outlet']:
                a.append(i['Item_Identifier'])
                salesArray['sales'] = float(i['Item_Outlet_Sales'])
                salesArray['itemno'] = i['Item_Identifier']
                b.append(salesArray)          
    a.sort()
    c = sorted(b, key=sortFunction,reverse=True)
    f.close()
    return {
        "data" : a,
        "outletSales": c
    }


@app.route('/getOutletOverview',methods=['POST'])
def get_outletOverview():
    f = open('data/train.json',encoding='utf-8-sig')
    data = json.load(f)
    categories = get_Categories(data, request.json['outlet'])
    return categories

def get_Categories(data, outlet):
    categories = {
    'Snack Foods':0,
    'Fruits and Vegetables':0,
    'Household':0,
    'Frozen Foods':0,
    'Dairy':0,
    'Baking Goods':0,
    'Canned':0,
    'Meat':0,
    'Health and Hygiene':0,
    'Soft Drinks':0,
    'Others':0,
    'Breads':0,
    'Breakfast':0,
    'Hard Drinks':0,
    'Seafood':0,
    'Starchy Foods':0,
    }
    for i in data:
        if i['Outlet_Identifier'] == outlet:
            Item_Type=i['Item_Type']
            categories[Item_Type] = categories[Item_Type]+float(i['Item_Outlet_Sales'])
    return json.dumps(categories)    

@app.route('/getTierLevelOverview',methods=['POST'])
def getTierLevelData():
    dict={}
    outlets =[]
    tierLevelData=[]
    f = open('data/train.json',encoding='utf-8-sig')
    data = json.load(f)
    for i in data:
        if i['Outlet_Location_Type'] == request.json['tier']:
            outlets.append(i['Outlet_Identifier'])
            tierLevelData.append(i)
    outlets = set(outlets)
    for outlet in outlets:
        dict[outlet]={}
        dict[outlet]=get_Categories(tierLevelData, outlet)
    return json.dumps(dict)
    
@app.route('/getItemFatContent',methods=['POST'])
def getCategoryRelatedInfo():
    categories = {
    'Low Fat':0,
    'Regular':0
    }
    f = open('data/train.json',encoding='utf-8-sig')
    data = json.load(f)
    for i in data:
        if i['Outlet_Identifier'] == request.json['outlet']:
            if i['Item_Type'] == request.json['category']:
                Item_Fat_Content=i['Item_Fat_Content']
                if (Item_Fat_Content == "Low Fat") or (Item_Fat_Content == "LF"):
                    categories['Low Fat'] = categories['Low Fat']+float(i['Item_Outlet_Sales'])
                else:
                    categories['Regular'] = categories['Regular']+float(i['Item_Outlet_Sales'])
    return json.dumps(categories) 





@app.route('/getitemdetailbasedOnitem',methods=['POST'])
def get_Item_Identifier():
    f = open('data/train.json',encoding='utf-8-sig')
    data = json.load(f)
    a = []
    for i in data:
        if i['Item_Identifier'] == request.json['Item_no'] and i['Item_Type'] == request.json['category'] and i['Outlet_Identifier'] == request.json['outlet']:
            a.append(i)
    f.close()
    return {
        "data" : a
    }

@app.route('/compareitemsalesacrossoutlets',methods=['POST'])
def get_Item():
    f = open('data/train.json',encoding='utf-8-sig')
    data = json.load(f)
    a = []
  
    for i in data:
        obj = {}
        if i['Item_Identifier'] == request.json['Item_no'] :
            obj['Outlet'] = i['Outlet_Identifier']
            obj['Sales']= i['Item_Outlet_Sales']
            a.append(obj)      
    f.close()
    return {
        "data" : a
    }

@app.route('/getitemsBasedOnCategory',methods=['POST'])
def getItemType():
    f = open('data/train.json',encoding='utf-8-sig')
    data = json.load(f)
    a = []
    for i in data:
        if i['Item_Type'] == request.json['category']:
            a.append(i['Item_Identifier'])
    a = list(set(a)) 
    a.sort()    
    f.close()
    return {
        "data" : a
    }

@app.route('/getItemDetails', methods=['POST'])
def getItemInfo():
    f = open('data/train.json',encoding='utf-8-sig')
    data = json.load(f)
    a = {}
    # print(request.json['itemNumber'])
    for i in data:
        if i['Item_Identifier'] == request.json['itemNumber']:
            a = i
    f.close()
    # print(a)
    return{
        "data" : a
    }



# prediction function
def PredictSales(input):
    
    loaded_model = pickle.load(open("finalized_model.pkl", "rb"))
    result = loaded_model.predict(input)
    print(result)
    return result[0]
  
@app.route('/getPrediction', methods = ['POST'])
def getprediction():
    f = open('data/cleaneddata.json',encoding='utf-8-sig')
    data = json.load(f)
    a = {}
    print(request.json)
    for i in data:
        if i['Item_Identifier'] == request.json['itemNumber']:
            a = i
    f.close()
    print(a)
    # itemType = itemTypeMapping[a['Item_Type']]
    outletYears = 2013 - int(a['Outlet_Establishment_Year'])
    # outlet = outletMapping[a['Outlet_Identifier']]
    # Item_Fat_Content_0 = 
    # Item_Fat_Content_1 = 
    # Item_Fat_Content_2 = 
    # Outlet_Size_0 = 
    # Outlet_Size_1 = 
    # Outlet_Size_2 = 
    # Outlet_Location_Type_0 = 
    # Outlet_Location_Type_1 = 
    # Outlet_Location_Type_2 = 
    # Outlet_Type_0 = 
    # Outlet_Type_1 = 
    # Outlet_Type_2 = 
    # Outlet_Type_3 = 
    # New_Item_Type_0 = 
    # New_Item_Type_1 = 
    # New_Item_Type_2 =

    # Index(['Item_Weight', 'Item_Visibility', 'Item_Type', 'Item_MRP',
    #    'Outlet_Years', 'Outlet', 'Item_Fat_Content_0', 'Item_Fat_Content_1',
    #    'Item_Fat_Content_2', 'Outlet_Size_0', 'Outlet_Size_1', 'Outlet_Size_2',
    #    'Outlet_Location_Type_0', 'Outlet_Location_Type_1',
    #    'Outlet_Location_Type_2', 'Outlet_Type_0', 'Outlet_Type_1',
    #    'Outlet_Type_2', 'Outlet_Type_3', 'New_Item_Type_0', 'New_Item_Type_1',
    #    'New_Item_Type_2'],
    input = [[ request.json['itemWeight'],
     request.json['itemVisibility'],
      a['Item_Type'], request.json['itemPrice'],
      outletYears , a['Outlet'], a['Item_Fat_Content_0'], 
      a['Item_Fat_Content_1'],a['Item_Fat_Content_2'], 
      a['Outlet_Size_0'],a['Outlet_Size_1'], a['Outlet_Size_2'], 
      a['Outlet_Location_Type_0'], a['Outlet_Location_Type_1'],
      a['Outlet_Location_Type_2'], a['Outlet_Type_0'],
      a['Outlet_Type_1'], a['Outlet_Type_2'], a['Outlet_Type_3'], 
      a['New_Item_Type_0'], a['New_Item_Type_1'], a['New_Item_Type_2'] ]]
    print(input)
    
    value = PredictSales(input)
    value = np.exp(value) - 1
    
    print(value)
    return{
        "data" : value
    }

