# -*- coding: utf-8 -*-
import unittest
import parsingYoutubeChannelId
import parsingYoutubeChannelVideo
import serviceMongoClient
import updateYoutubeChannelList

class DataHandlingTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):

        print("set up class")
        return

    def setUp(self):

        print("setUp")
        self.db = serviceMongoClient.ServiceMongoClient().getDB()
        self.curaTubeNameOnlyCollection = self.db["curaTubeNameOnly"]
        self.curaTubeCollection = self.db["curaTube"]
        self.channelListCollection = self.db["channelList"]
        self.curaTubeDetailCollection = self.db["curaTubeDetail"]

    def test_ServiceMongoClient(self):

        MongoDbInsertResult = self.curaTubeNameOnlyCollection.insert_one({"curaTubeName" : "unitTest","channelList" : ['PewDiePie']})
        self.assertIsNotNone(MongoDbInsertResult)

    def test_parsingYoutubeChannelId(self):

        parsingYoutubeChannelIdClass = parsingYoutubeChannelId.ParsingYoutubeChannelId()
        parsingYoutubeChannelIdClass.start()
        parsingYoutubeChannelIdResult = self.curaTubeCollection.find_one({"curaTubeName":"unitTest"}).get("channelList")[0].get("id")
        self.assertIsNotNone(parsingYoutubeChannelIdResult)

    def test_updateYoutbeChannelList(self):

        print("test_updateYoutbeChannelList")
        self.curaTubeCollection.insert_one({"curaTubeName": "unitTest", "channelList": ['PewDiePie']})
        updateYoutubeChannelListResult = self.curaTubeCollection.find_one({"curaTubeName": "unitTest"})
        updateYoutubeChannelListClass = updateYoutubeChannelList.UpdateYoutubeChannelList()
        updateYoutubeChannelListClass.updateYoutubeChannelData(updateYoutubeChannelListResult)
        parsingYoutubeChannelVideoResult = self.curaTubeDetailCollection.find_one({"curaTubeName": "unitTest"}).get("ratingOrderItems")[0].get("etag")
        print(parsingYoutubeChannelVideoResult)
        self.assertIsNotNone(parsingYoutubeChannelVideoResult)

    def test_parsingYoutubeChannelVideo(self):

        parsingYoutubeChannelVideoClass = parsingYoutubeChannelVideo.ParsingYoutubeChannelVideo()
        updateYoutubeChannelListResult = self.channelListCollection.find_one({"name":"PewDiePie"})
        updateYoutubeChannelListClass = updateYoutubeChannelList.updateYoutubeChannelList()
        updateYoutubeChannelListClass.updateYoutubeChannelData(updateYoutubeChannelListResult)
        parsingYoutubeChannelVideoClass.parsingYoutubeChannelVideo(updateYoutubeChannelList)
        parsingYoutubeChannelVideoResult = self.channelListCollection.find_one({"name": "PewDiePie"}).get("ratingOrderItems")[0].get("etag")
        print(parsingYoutubeChannelVideoResult)
        self.assertIsNotNone(parsingYoutubeChannelVideoResult)

    def tearDown(self):

        print("this is tear down")
        return

    @classmethod
    def tearDownClass(cls):

        print("tearDown class")

if __name__ == '__main__':
    unittest.main()

