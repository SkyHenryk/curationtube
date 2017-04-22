from pymongo import MongoClient

class ServiceMongoClient():

    baseDbName = 'channelList'
    uri = 'mongodb://url'
    maxPoolSize = 1024
    socketKeepAlive = True
    socketTimeoutMS = 1000 * 60
    connectTimeoutMS = 1000 * 60
    serverSelectionTimeoutMS = 1000 * 60
    connection = None
    
    def __init__(self):

        self.mongo = MongoClient(
            host=self.uri,
            socketKeepAlive=ServiceMongoClient.socketKeepAlive,
            socketTimeoutMS=ServiceMongoClient.socketTimeoutMS,
            connectTimeoutMS=ServiceMongoClient.connectTimeoutMS,
            serverSelectionTimeoutMS=ServiceMongoClient.serverSelectionTimeoutMS,
            maxPoolSize=ServiceMongoClient.maxPoolSize,
            connect=False
        )
        self.db = self.mongo["CuraTubeDev"]

    def getDB(self):

        return self.db