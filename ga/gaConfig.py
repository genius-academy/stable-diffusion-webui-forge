import os
import json


class GaConfig:
    config = None

    def __init__(self):
        self.loadConfig()

    def loadConfig(self):
        current_path = os.path.dirname(__file__)
        with open(os.path.join(current_path, 'config.json')) as fp:
            self.config = json.load(fp)


    def getByKey(self, key):
        if key in self.config:
            return self.config[key]
        return None

    def isAdmin(self):
        if 'admin' == self.getByKey('role'):
            return True
        return False

if __name__ == '__main__':
    gaConfig = GaConfig()
    print(gaConfig.isAdmin())