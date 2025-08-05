from flask import Flask, request 
import pandas as pd
import json 
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from flask_cors import CORS, cross_origin
from urllib.parse import urlencode
import re
import os





app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'



rf=RandomForestClassifier(n_estimators=30,min_samples_split=15,random_state=137)

class MissingDict(dict):
    __missing__ = lambda self, key: key

map_values = {"Brighton and Hove Albion": "Brighton",
              "Manchester Utd": "Manchester United",
              "Newcastle Utd": "Newcastle United", 
              "Tottenham Hotspur": "Tottenham", 
              "West Ham United": "West Ham", 
              "Wolverhampton Wanderers": "Wolves",
              "Wolverhampton Wanderer": "Wolves",
              "Nott'ham Forest":"Nottingham",
              "Nottingham Fore":"Nottingham",
              "heffield United":"Sheffield United",
              "Sheffield Utd":"Sheffield United",
              "Chelse":"Chelsea",
              "Asron Vill":"Aston Villa"
             } 
mapping = MissingDict(**map_values)

# Setup url route which will calculate 
# total sum of array. 
def rolling_averages(group, cols, new_cols):
    group=group.sort_values("date")
    rolling_stats=group[cols].rolling(3,closed='left').mean()
    group[new_cols]=rolling_stats
    group=group.dropna(subset=new_cols)
    return group


# def make_one_prediction(predictors,test_data):
#     preds=rf.predict(test_data[predictors])
#     # combined=pd.DataFrame(dict(actual=test_data["target"],predicted=preds), index=test.index)
#     # precision=precision_score(test["target"],preds)
#     return combined

def TrainModel(data):
    matches=pd.read_csv('matchesYt.csv',index_col=0)
    
    matches=matches.groupby("team").get_group(data["team"])
    matches["target"]=matches["result"].astype("category").cat.codes
    new_row=pd.DataFrame(data,index=[0])
    matches = pd.concat([matches,new_row], ignore_index = True)
    
    matches["date"]=pd.to_datetime(matches["date"])
    matches["opp_code"]=matches["opponent"].astype("category").cat.codes
    matches["hour"]=matches["time"].str.replace(":.+","",regex=True).astype("int")
    matches["formation"].ffill(inplace=True)
    matches["formation_code"]=matches["formation"].str.replace(r'\D',"",regex=True).astype("int")
    matches["day_code"]=matches["date"].dt.dayofweek
    matches["venue_code"]=matches["venue"].astype("category").cat.codes
    matches["target"]=(matches["result"]=="W").astype("int")
    cols=["gf","ga","sh","sot","dist","fk","pk","pkatt"]
    
    predictors=["venue_code","opp_code","hour","day_code",'formation_code']
    
    new_cols=[f"{c}_rolling" for c in cols]
    
    
    
    matches_rolling=rolling_averages(matches,cols,new_cols)
    special=matches_rolling.groupby("opponent").get_group(data["opponent"])
    if(special.shape[0]>=2):
        matches_rolling=special
    matches_rolling.index=[i for i in range(matches_rolling.shape[0])]
    matches_rolling.sort_index(axis=0, ascending=True, inplace=False, kind='quicksort')
    last_index=matches_rolling.index.sort_values()[-1]
    # print("LATS INDEX=",matches_rolling.index[-1])
    
    prev_matches=matches_rolling.loc[:matches_rolling.shape[0]-2]
    
    train=prev_matches
    rf.fit(train[predictors+new_cols],train['target'])
    return rf, matches_rolling.loc[matches_rolling.shape[0]-1:]


@app.route('/', methods = ['GET']) 
@cross_origin()
def started_server():
    return "Server Started!" 

@app.route('/predict', methods = ['POST']) 
@cross_origin()
def predict_match(): 

        #Request Body Data:
        data = request.get_json()
        print(data)

        model,test_data=TrainModel(data)

        cols=["gf","ga","sh","sot","dist","fk","pk","pkatt"]
        new_cols=[f"{c}_rolling" for c in cols]
        predictors=["venue_code","opp_code","hour","day_code",'formation_code']


        result=model.predict(test_data[predictors+new_cols]).astype(int).tolist()[0]
        print(result)

        data2=data
        team=data["team"]
        data2["team"]=data["opponent"]
        data2["opponent"]=team
        data2["formation"]=np.nan
        if(data["venue"]=="Home"):
            data2["venue"]="Away"
        else:
            data2["venue"]="Home"


        model2,test_data2=TrainModel(data2)

        result2=model2.predict(test_data2[predictors+new_cols]).astype(int).tolist()[0]

        finalresult=result
        if(result==result2):
            finalresult=0
        elif(result==2.0 and result2==1.0):
            finalresult=2
        elif(result==1.0 and result2==2.0):
            finalresult=1
        elif(result==0.0 and result2==1.0):
            finalresult=2
        elif(result==0.0 and result2==2.0):
            finalresult=1



        print("result=",finalresult)


        # Return data in json format 
        return json.dumps({"result":finalresult}) 




if __name__ == "__main__": 
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
    print("Server is runnin on port 5000")