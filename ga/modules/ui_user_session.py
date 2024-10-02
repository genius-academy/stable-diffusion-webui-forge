import os

import gradio as gr

from modules import shared, sd_models
from modules.paths_internal import script_path

# 用户UI所需的Session数据
class UiSession:

    component_dict = {}
    components = []

    def getSdModelComId(self, tabname):
        return f"{tabname}_current_sd_model"

    # 创建用户会话相关ui
    def create_cookies(self, tabname):
        comId = self.getSdModelComId(tabname)
        model_title = shared.opts.sd_model_checkpoint
        current_sd_model = gr.Textbox(elem_id=comId, value=model_title, visible=False)
        self.component_dict[comId] = current_sd_model
        self.components.append(current_sd_model)
        return current_sd_model

def loadCurrentModel(sdModelTitle=None):
    # checkpoint_info = sd_models.CheckpointInfo(f"{sd_models.model_path}\deliberate_v2.safetensors")
    checkpoint_info = sd_models.checkpoint_aliases.get(sdModelTitle)
    if checkpoint_info:
        checkpoint_info = sd_models.checkpoint_aliases.get(shared.opts.sd_model_checkpoint)

    sd_models.reload_model_weights(info=checkpoint_info)
    return shared.sd_model

def onSelectSdModel(text, evt: gr.SelectData):
    return text, text

ga_path = os.path.join(script_path, "ga")
def html_path(filename):
    return os.path.join(ga_path, "html", filename)
def html(filename):
    path = html_path(filename)

    if os.path.exists(path):
        with open(path, encoding="utf8") as file:
            return file.read()

    return ""