import datetime
import serviceMongoClient
from random import shuffle

class UpdateYoutubeChannelList():

    def __init__(self):

        self.db = serviceMongoClient.ServiceMongoClient().getDB()
        self.channelListCollection = self.db["channelList"]
        self.tubeCollection = self.db["tubeList"]
        self.dbToday =  datetime.date.today().strftime("%Y-%m-%d")
        self.startTime = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

        with open("./FailParsingYoutubeIdByYoutubeName.txt" , "a") as f:
            f.write("")
        with open("./FailParsingYoutubeIdByYoutubeName.txt" , "r") as f:
            self.failList = f.readlines()

    def start(self):

        self.matchingYoutubeChannelDataFromMongoDB()

    def matchingYoutubeChannelDataFromMongoDB(self):

        tubeList = self.tubeCollection.find({})
        if tubeList is None:
            return
        for tube in tubeList:
            self.updateTubeData(tube)

    def setLastPlaylistForDelete(self,tube):

        LastPlaylistIdList = []
        if tube.get("videoUrl") is None:
            return LastPlaylistIdList
        for urlName, tubeVideoUrl in tube.get("videoUrl").items():
            playlistId =tubeVideoUrl.split("list=")[1] if tubeVideoUrl is not None else None
            LastPlaylistIdList.append(playlistId)
        return LastPlaylistIdList

    def updateTubeData(self,tubeChannelList):

        todayVideoItems = []
        thisweekVideoItems = []
        viewCountOrderItems = []
        channelsDataWithoutVideoItems = []
        for channelName in tubeChannelList.get("channelList"):
            channel = self.channelListCollection.find_one({"name" : channelName.get("name") })
            if channel is None:
                continue
            channelsDataWithoutVideoItem = {}
            channelsDataWithoutVideoItem.update(channel)
            channelsDataWithoutVideoItem.pop('videoItems', None)
            channelsDataWithoutVideoItems.append(channelsDataWithoutVideoItem)

            channelDetailVideoItems = channel.get("videoItems")
            if channelDetailVideoItems is None:
                continue
            todayVideoItems += channelDetailVideoItems.get("todayVideoItems")
            thisweekVideoItems += channelDetailVideoItems.get("thisweekVideoItems")
            viewCountOrderItems += channelDetailVideoItems.get("viewCountOrderItems")[:5] if  channelDetailVideoItems.get("viewCountOrderItems") is not None else []

        todayVideoItems = self.removeNoHalfEngVideo(todayVideoItems)
        thisweekVideoItems = self.removeNoHalfEngVideo(thisweekVideoItems)
        viewCountOrderItems = self.removeNoHalfEngVideo(viewCountOrderItems)
        shuffle(todayVideoItems)
        shuffle(thisweekVideoItems)
        shuffle(viewCountOrderItems)
        tubeChannelList.update({"videoItems": {"todayVideoItems" : todayVideoItems,
                                                "thisweekVideoItems" : thisweekVideoItems,
                                                "viewCountOrderItems" : viewCountOrderItems
                                               }
                                })
        self.tubeCollection.update_one({"tubeName": tubeChannelList.get("tubeName")}, {"$set": tubeChannelList})
        self.tubeCollection.update_one({"tubeName": tubeChannelList.get("tubeName")}, {"$set": {"channelList" : channelsDataWithoutVideoItems} })
        return tubeChannelList

    def removeNoHalfEngVideo(self, VideoItems):

        resultItems = []

        def isEnglish(s):
            try:
                s.encode('ascii')
            except UnicodeEncodeError:
                return False
            else:
                return True

        for VideoItem in VideoItems:
            title = VideoItem.get("snippet").get("title")
            enCount = 0
            for titleString in title:
                if isEnglish(titleString):
                    enCount += 2
                else:
                    enCount -= 1
            if enCount > 0 :
                resultItems.append(VideoItem)

        return resultItems

    def log(self, *args):

        timeNow = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        logFileName = "./log/parsingYoutubeChannelVideo_log_{startTime}.txt".format(startTime = self.startTime)
        f = open(logFileName, 'a')
        f.write("[" + str(timeNow) + "]")
        for arg in args:
            f.write(str(arg))
        f.write("\n")

    def uploadTubeData(self, tubeUpdated):

        tubeName = tubeUpdated.get("tubeName")
        tubeUpdatedVideoItems = tubeUpdated.get("videoItems")
        todayVideoItems = tubeUpdatedVideoItems.get("todayVideoItems")
        thisweekVideoItems = tubeUpdatedVideoItems.get("thisweekVideoItems")
        viewCountOrderItems = tubeUpdatedVideoItems.get("viewCountOrderItems")

        todayVideoUrl = self.MakingYoutubePlaylistWithItems("today", tubeName, todayVideoItems)
        thisweekVideoUrl = self.MakingYoutubePlaylistWithItems("thisweek", tubeName, thisweekVideoItems)
        viewCountOrderUrl = self.MakingYoutubePlaylistWithItems("mostView", tubeName, viewCountOrderItems)

        tubeUpdated.update({"videoUrl":{"todayVideoUrl": todayVideoUrl,
                                        "thisweekVideoUrl": thisweekVideoUrl,
                                        "viewCountOrderUrl": viewCountOrderUrl
                                       },
                            "lastUpdate":self.dbToday
                            })

        if len(viewCountOrderItems) > 9:
            thumbnailsDefaultItems = []
            thumbnailsMediumItems = []
            thumbnailsHighItems = []
            for index in range(0,9):
                thumbnailsDefaultItems.append(viewCountOrderItems[index].get("snippet").get("thumbnails").get("default").get("url"))
                thumbnailsMediumItems.append(viewCountOrderItems[index].get("snippet").get("thumbnails").get("medium").get("url"))
                thumbnailsHighItems.append(viewCountOrderItems[index].get("snippet").get("thumbnails").get("high").get("url"))
            thumbnail = {"thumbnail":{"thumbnailsDefaultItems": thumbnailsDefaultItems, "thumbnailsMediumItems": thumbnailsMediumItems,"thumbnailsHighItems": thumbnailsHighItems }}
            tubeUpdated.update(thumbnail)
        self.tubeCollection.update_one({"tubeName": tubeName},{"$set":tubeUpdated})

if __name__ == '__main__':
    startTime = datetime.datetime.now()
    updateYoutubeChannelList().start()
    endTime = datetime.datetime.now()
    print("spend time : " , endTime - startTime) # spend time :  0:00:31.334179
