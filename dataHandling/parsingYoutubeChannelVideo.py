import ujson
import asyncio
import traceback
import datetime
import serviceMongoClient
import serviceAsyncHttpReqeust
import json
import aiofiles
import time

class ParsingYoutubeChannelVideo():
    
    googleApiKey = "key"
    
    def __init__(self):

        self.db = serviceMongoClient.ServiceMongoClient().getDB()
        self.channelListCollection = self.db["channelList"]
        self.today = datetime.datetime.now()
        self.dbToday = self.today.strftime("%Y-%m-%d")
        self.httpClass = serviceAsyncHttpReqeust.HttpClass()
        self.loop = asyncio.get_event_loop()
        self.startTime = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        self.quotas = 0
        with open("./FailParsingYoutubeIdByYoutubeName.txt" , "r") as f:
            self.failList = f.readlines()

    def start(self):

        self.selectingYoutubeChannelListFromMongoDBForParsing()
        self.loop.run_until_complete(self.close())

    def selectingYoutubeChannelListFromMongoDBForParsing(self):

        channelList = self.channelListCollection.find({})
        tasks = []
        for channelData in channelList:
            tasks.append(asyncio.ensure_future(self.parsingYoutubeChannelVideo(channelData)) )
            if len(tasks) > 500:
                self.loop.run_until_complete(asyncio.gather(*tasks))
                tasks = []
                self.loop.run_until_complete(self.log("time.sleep(60)"))
                time.sleep(60) # for quatos
            if self.quotas > 1000000:
                self.loop.run_until_complete(self.log("used all quotas"))
                quit()
        self.loop.run_until_complete(self.log("fininshed. use quotas : " + str(self.quotas) ))

    async def parsingYoutubeChannelVideo(self,channelData):

        channelName = channelData.get('name')
        try:
            print("parsing video start : " + channelName)
            todayVideoItems, thisweekVideoItems = await self.parsingYoutubeChannelVideoName(channelData)
            await self.parsingYoutubeChannelVideoDetail(channelData, todayVideoItems, thisweekVideoItems)
        except:
            print(traceback.format_exc())
            async with aiofiles.open("./FailparsingYoutubeChannelVideo.txt","a") as f:
                await f.write(channelName + "\n")
            await self.log("parsing video fail : " + channelName)

    async def parsingYoutubeChannelVideoName(self, channelData):

        todayVideoItems = []
        thisweekVideoItems = []
        channelId = channelData.get('id')
        parsingYoutubeChannelVideoUrl = "https://www.googleapis.com/youtube/v3/search"
        parsingYoutubeChannelVideoHeader = {'cache-control': "no-cache"}
        self.quotas += 102
        parsingYoutubeChannelVideoQueryString = {"part":"Snippet","channelId":channelId,"maxResults":"10","key":self.googleApiKey,"order":"date","type":"video"}
        parsingYoutubeChannelVideoRequestResult = await self.httpClass.executeReturnData(method="GET", url=parsingYoutubeChannelVideoUrl,
                                                                                         params=parsingYoutubeChannelVideoQueryString,
                                                                                         headers=parsingYoutubeChannelVideoHeader)
        parsingYoutubeChannelVideoItemsDate = ujson.loads(parsingYoutubeChannelVideoRequestResult).get("items")
        if parsingYoutubeChannelVideoItemsDate is not None:
            updatingVideoIdString = ",".join(
                str(x.get("id").get("videoId")) for x in parsingYoutubeChannelVideoItemsDate)

            self.quotas += 9
            updatingYoutubeChannelVideoUrl = "https://www.googleapis.com/youtube/v3/videos"
            updatingYoutubeChannelVideoHeader = {'cache-control': "no-cache"}
            updatingYoutubeChannelVideoQueryString = {"part": "Snippet,contentDetails,status,statistics",
                                                     "id": updatingVideoIdString,
                                                     "key": self.googleApiKey}

            updatingYoutubeChannelVideoRequestResult = await self.httpClass.executeReturnData(method="GET",
                                                                                              url=updatingYoutubeChannelVideoUrl,
                                                                                              params=updatingYoutubeChannelVideoQueryString,
                                                                                              headers=updatingYoutubeChannelVideoHeader)
            updatingYoutubeChannelVideoItemsDate = ujson.loads(updatingYoutubeChannelVideoRequestResult).get("items")
            updatingYoutubeChannelVideoItemsDate = list(filter(lambda x: x.get("status").get("embeddable"), updatingYoutubeChannelVideoItemsDate))

            if updatingYoutubeChannelVideoItemsDate is not None:
                for updatingYoutubeChannelVideoData in updatingYoutubeChannelVideoItemsDate:
                    publishDate =  datetime.datetime.strptime(updatingYoutubeChannelVideoData.get("snippet").get("publishedAt").split("T")[0],"%Y-%m-%d")
                    if publishDate >= self.today - datetime.timedelta(days=1):
                        todayVideoItems.append(updatingYoutubeChannelVideoData)
                    if publishDate >= self.today - datetime.timedelta(days=7):
                        thisweekVideoItems.append(updatingYoutubeChannelVideoData)
        return todayVideoItems,thisweekVideoItems

    async def parsingYoutubeChannelVideoDetail(self, channelData, todayVideoItems, thisweekVideoItems):

            self.quotas += 102
            updatingYoutubeChannelVideoItemsViewCount = []
            channelId = channelData.get('id')
            channelName = channelData.get('name')
            parsingYoutubeChannelVideDetailoUrl = "https://www.googleapis.com/youtube/v3/search"
            parsingYoutubeChannelVideDetailoHeader = {'cache-control': "no-cache"}
            parsingYoutubeChannelVideDetailoQueryString = {"part":"Snippet","channelId":channelId,"maxResults":"5","key":self.googleApiKey,"order":"viewCount","type":"video"}
            parsingYoutubeChannelVideDetailoRequestResult = await self.httpClass.executeReturnData(method="GET", url=parsingYoutubeChannelVideDetailoUrl,
                                                                                                   params=parsingYoutubeChannelVideDetailoQueryString,
                                                                                                   headers=parsingYoutubeChannelVideDetailoHeader)
            parsingYoutubeChannelVideDetailoItemsViewCount = ujson.loads(parsingYoutubeChannelVideDetailoRequestResult).get("items")
            if parsingYoutubeChannelVideDetailoItemsViewCount is not None:
                updatingVideoIdString = ",".join(
                    str(x.get("id").get("videoId")) for x in parsingYoutubeChannelVideDetailoItemsViewCount)

                self.quotas += 9
                updatingYoutubeChannelVideoUrl = "https://www.googleapis.com/youtube/v3/videos"
                updatingYoutubeChannelVideoHeader = {'cache-control': "no-cache"}
                updatingYoutubeChannelVideoQueryString = {"part": "Snippet,contentDetails,status,statistics",
                                                          "id": updatingVideoIdString,
                                                          "key": self.googleApiKey}

                updatingYoutubeChannelVideoRequestResult = await self.httpClass.executeReturnData(method="GET",
                                                                                                  url=updatingYoutubeChannelVideoUrl,
                                                                                                  params=updatingYoutubeChannelVideoQueryString,
                                                                                                  headers=updatingYoutubeChannelVideoHeader)
                updatingYoutubeChannelVideoItemsViewCount = ujson.loads(updatingYoutubeChannelVideoRequestResult).get("items")
                updatingYoutubeChannelVideoItemsViewCount = list(filter(lambda x: x.get("status").get("embeddable"), updatingYoutubeChannelVideoItemsViewCount))

            channelData.update(
                {"videoItems":{
                    "todayVideoItems": todayVideoItems,
                    "thisweekVideoItems": thisweekVideoItems,
                    "viewCountOrderItems" : updatingYoutubeChannelVideoItemsViewCount}})

            parsingYoutubeChannelVideDetailoItemsDate = ujson.loads(parsingYoutubeChannelVideDetailoRequestResult).get("items")

            if parsingYoutubeChannelVideDetailoItemsDate is None and parsingYoutubeChannelVideDetailoItemsViewCount is None:
                await self.log("parsing video fail : " + channelName + " , no result or Queries per day")
            channelData.update({"lastUpdate":self.dbToday})
            updateResult = self.channelListCollection.update_one({'id':channelId},{"$set":channelData})
            await self.log("parsing video success : " + channelName + " , " + json.dumps(updateResult.raw_result))
        
    async def log(self, *args):

        print(args)
        timeNow = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        logFileName = "./log/parsingYoutubeChannelVideo_log_{startTime}.txt".format(startTime = self.startTime)
        async with aiofiles.open(logFileName, 'a') as f:
            await f.write("[" + str(timeNow) + "]")
            for arg in args:
                await f.write(str(arg))
            await f.write("\n")

    async def close(self):

        await self.httpClass.close()

if __name__ == '__main__':
    startTime = datetime.datetime.now()
    parsingYoutubeChannelVideo().start()
    endTime = datetime.datetime.now()
    print("spend time : " , endTime - startTime) # spend time :  0:09:46.100936

