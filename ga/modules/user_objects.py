# 引入模块
import io
import json
import logging
import traceback
import uuid

from obs import ObsClient, PutObjectHeader, HeadPermission

from modules.shared import opts

ACCESS_KEY_ID = '7WDZNPEBXERY2ZTLY5RI'
SECRET_ACCESS_KEY = 'tu2LUwr4oEmmEzeBZU3rIGbDCeXjreXvFhfkyZqb'
ENDPOINT = 'obs.ap-southeast-3.myhuaweicloud.com'
BUCKET_IMG = 'imgs-f20c'

# 创建obsClient实例
obsClient = ObsClient(access_key_id=ACCESS_KEY_ID, secret_access_key=SECRET_ACCESS_KEY, server=ENDPOINT)

def uploadImgsToObs(images, generation_info_js):

        if len(images)==0:
            return

        image_urls = []
        for image in images:
            try:
                objName = f'{uuid.uuid4().hex }.{opts.samples_format}'
                img_byte=io.BytesIO()
                image.save(img_byte, format=opts.samples_format)
                image_binary = img_byte.getvalue()
                headers = PutObjectHeader()
                headers.acl = HeadPermission.PUBLIC_READ
                # 文件上传
                resp = obsClient.putContent(bucketName=BUCKET_IMG, objectKey=objName, content=image_binary, headers=headers)
                # 返回码为2xx时，接口调用成功，否则接口调用失败
                if resp.status < 300:
                    objectUrl = resp.body['objectUrl']
                    image_urls.append(objectUrl)
                    logging.info('Put File Succeeded, objectUrl={}', objectUrl)

                else:
                    logging.error('Put File Failed, ', resp.requestId, resp.errorCode, resp.errorMessage)

            except:
                logging.error("Put File Failed.", traceback.format_exc())

        generation_info = json.loads(generation_info_js)
        generation_info['image_urls'] = image_urls
        return json.dumps(generation_info)



# if __name__ == '__main__':
#     obsClient.close()
