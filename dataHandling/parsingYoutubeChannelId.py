import ujson
import serviceMongoClient
import asyncio
import serviceAsyncHttpReqeust
from multiprocessing import Process
import datetime
import aiofiles

class ParsingYoutubeChannelId():

    googleApiKey = "apikey"

    def __init__(self):

        self.db = serviceMongoClient.ServiceMongoClient().getDB()
        self.channelListCollection = self.db["channelList"]
        self.tubeCollection = self.db["tubeList"]
        with open("./FailParsingYoutubeIdByYoutubeName.txt", "a") as f:
            f.write("")
        with open("./FailParsingYoutubeIdByYoutubeName.txt" , "r") as f:
            self.failList = f.readlines()
        self.loop = asyncio.get_event_loop()
        self.httpClass = serviceAsyncHttpReqeust.HttpClass()
        self.startTime = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

    def start(self):

        self.selectingYoutubeNameOnlyListFromMongoDB()
        self.loop.run_until_complete(self.close())

    async def close(self):
        
        await self.httpClass.close()

    def selectingYoutubeNameOnlyListFromMongoDB(self):

        youtubeNameOnlyListFind = self.tubeCollection.find({"isChannelListUpdated": {"$ne" : True} })
        for YoutubeNameOnlyData in youtubeNameOnlyListFind:
            self.parsingYoutubeChannelIdByChannelName(YoutubeNameOnlyData)

    def parsingYoutubeChannelIdByChannelName(self, youtubeNameOnlyData):

        tubeName = youtubeNameOnlyData.get('tubeName')
        youtubeNameList = youtubeNameOnlyData.get('channelList')
        tasks = []
        for youtubeNameDict in youtubeNameList:
            youtubeName = youtubeNameDict.get("name")
            hasDuplicate = self.channelListCollection.find_one({"name": youtubeName})
            if youtubeName in self.failList:
                continue
            if hasDuplicate is not None:
                continue
            tasks.append(asyncio.ensure_future(self.parsingChannelId(youtubeNameDict)) )
        self.loop.run_until_complete(asyncio.gather(*tasks))

        self.tubeCollection.update_one({"tubeName": tubeName}, {"$set": {"isChannelListUpdated": True}})

    async def parsingChannelId(self, youtubeNameDict):
        
        try:
            parsingChannelIdfromChannelNameUrl = "https://www.googleapis.com/youtube/v3/channels"
            parsingChannelIdfromChannelNameQueryString = {"part": "snippet", "key": self.googleApiKey}
            searchType = None
            youtubeNameDictType = youtubeNameDict.get("type")
            youtubeNameDictId = youtubeNameDict.get("idname")
            youtubeNameDictName = youtubeNameDict.get("name")
            if "user" in youtubeNameDictType:
                searchType = {"forUsername": youtubeNameDictId}
            elif "channel" in youtubeNameDictType:
                searchType = {"id": youtubeNameDictId}
            parsingChannelIdfromChannelNameQueryString.update(searchType)
            parsingChannelIdfromChannelNameHeader = {'cache-control': "no-cache"}
            parsingChannelIdfromChannelNameResult = await self.httpClass.executeReturnData(method="GET", url=parsingChannelIdfromChannelNameUrl,
                                                                                                params=parsingChannelIdfromChannelNameQueryString,
                                                                                                headers=parsingChannelIdfromChannelNameHeader)
            youtubeNameDict.update(ujson.loads(parsingChannelIdfromChannelNameResult).get("items")[0])
            Process(target=self.SaveYoutubeChannelList, args=(youtubeNameDict, 0)).start()
            await self.log("parsing success : " + youtubeNameDictName)

        except:
            with open("./FailParsingYoutubeIdByYoutubeName.txt","a") as f:
                f.write(youtubeNameDictName + "\n")
            await self.log("parsing fail : " , youtubeNameDictName)

    def SaveYoutubeChannelList(self, youtubeNameDict, i=0):
        
        youtubeNameDictId = youtubeNameDict.get("idname")
        self.db = ServiceMongoClient.ServiceMongoClient().getDB()
        self.channelListCollection = self.db["channelList"]
        self.channelListCollection.delete_many({"id":youtubeNameDictId})
        self.channelListCollection.insert_one(youtubeNameDict)

    async def log(self, *args):
        
        print(args)
        timeNow = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        logFileName = "./log/parsingYoutubeChannelId_log_{startTime}.txt".format(startTime = self.startTime)
        async with aiofiles.open(logFileName, 'a') as f:
            await f.write("[" + str(timeNow) + "]")
            for arg in args:
                await f.write(str(arg))
            await f.write("\n")

if __name__ == '__main__':
    startTime = datetime.datetime.now()
    ParsingYoutubeChannelId().start()
    endTime = datetime.datetime.now()
    print("spend time : " , endTime - startTime) # spend time :  0:01:18.902934 with 4155 channels one channel for 3 quotas
