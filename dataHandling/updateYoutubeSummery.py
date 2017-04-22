# -*- coding: utf-8 -*-
import serviceMongoClient

db = serviceMongoClient.ServiceMongoClient().getDB()
tubeListCollection = db["tubeList"]
tubeListSummeryCollection = db["tubeListSummery"]
tubeList = tubeListCollection.find({})
for tube in tubeList:
    tubeSummery = {}
    tubeSummery.update(tube)
    tubeSummery.pop("videoItems",None)
    tubeName = tubeSummery.get("tubeName")
    tubeListSummeryCollection.delete_many({"tubeName": tubeName})
    tubeListSummeryCollection.insert_one(tubeSummery)

