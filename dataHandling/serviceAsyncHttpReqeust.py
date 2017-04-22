# -*- coding: utf-8 -*-

import aiohttp
import traceback

class HttpClass():

    connection = None

    async def start(self):

        try:
            if HttpClass.connection is not None:
                if HttpClass.connection.closed:
                    HttpClass.connection = None
            if HttpClass.connection is None:
                HttpClass.connection = aiohttp.TCPConnector()
        except:
            print(traceback.format_exc())

    async def executeReturnAll(self, url=None, method='GET', headers=None, body=None, params=None):
        if url == 'null' or url is None:
            return ''

        result = ''

        try:
            await self.start()
            if headers is None:
                headers = {'Connection': 'keep-alive'}

            response = await aiohttp.request(method,url=url,params=params,headers=headers,connector=HttpClass.connection,data=body)
            result = response
            response.close()

        except:
            pass

        return result

    async def executeReturnData(self, url=None, method='GET', headers=None, body=None, params=None):

        response = await self.executeReturnAll(url=url, method=method, headers=headers, body=body, params=params)
        data = await response.read()
        result = data.decode('utf-8')
        return result

    async def close(self):

        if HttpClass.connection is not None:
            if not HttpClass.connection.closed:
                HttpClass.connection.close()