import ga.gaConfig as GaConfig
from modules import shared

gaConfig = GaConfig.GaConfig()

def uiMenuControl():
    if gaConfig.isAdmin():
        print("***********Admin ui loading***********")

    # print(shared.demo)


