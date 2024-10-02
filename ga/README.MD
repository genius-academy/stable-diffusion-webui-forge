# 简介
Genius Academy 云SD WEBUI<br>
本项目基于Stable Diffusion web UI 1.5.1版本二次开发。


## 生产环境
使用Ubuntu-22操作系统，必须切换至root用户。    
部署生成环境需修改access.js的环境编码为“prod”。  
### 安装目录：
```
/usr/local/stable-diffusion-webui-1.5.1  
```
### Python：
使用Conda，建立webui所需的python3.10.6环境，并设置为基础环境。  
```
conda create --name webui python==3.10.6
conda activate webui
进入SD目录，导入python环境
python -c 'import venv'
python -m venv venv/
激活venv
source activate
```
#### Python部分包版本：
```
如已存在venv环境，则需使用venv环境中的python安装对应的包：
.\venv\Scripts\python.exe -m pip install

httpx==0.24.1
esdk-obs-python==3.24.3
pycryptodome==3.20.0

```
### Nvidia驱动：
```
sudo dpkg --list | grep nvidia-*  
可参考：https://blog.csdn.net/weixin_44076342/article/details/106544296  
```
### Nginx：
参考nginx.config配置。  
### 启动：
```
./start-webui.sh 或执行 ./webui-sh -f
启动前要先kill旧进程
```
### Ubuntu安装SD-WEBUI
```
参考：https://blog.csdn.net/yang553566463/article/details/132167437#:~:text=%E9%94%99%E8%AF%AF%201%E3%80%81This%20script%20must%20not%20be%20launched%20as,-c%20%27import%20venv%27%20python3%20-m%20venv%20venv%2F.%2Fwebui.sh%20-f
```

## 显卡驱动相关
### 查看nvidia cuda进程
```
nvidia-smi
```
### 查看驱动版本
```
nvcc -V
```
### Failed to initialize NVML: Driver/library version mismatch
```agsl
https://blog.csdn.net/qq_40947610/article/details/122276207
```

### 服务器间文件传输
```
GCloud示例（可通过类似的方式同步SD-WEBUI生产环境安装包）：
1. 先生成SSH KEY：
ssh-keygen -t rsa -f C:\Users\1\.ssh\gcloud_ssh_key -C herbie_hong -b 2048
ssh-keygen -t rsa -f ~/.ssh/gcloud_ssh_linux_sd -C herbie_hong -b 2048
2. 使用SCP传输：
scp -i ~/.ssh/gcloud_ssh_linux_sd stable-diffusion-webui-1.5.1.zip herbie_hong@34.128.98.88:/home/herbie_hong/
```

# 生产环境 ui-config 调整
```
"txt2img/Width/maximum": 1024,
"txt2img/Width/step": 4,
"txt2img/Height/maximum": 1024,
"txt2img/Height/step": 4,
"txt2img/Batch size/maximum": 4,
"txt2img/Script/visible": false,
"txt2img/Batch size/visible": false,
"txt2img/Batch count/visible": false,
"txt2img/Upscale by/value": 1.5,
"txt2img/Upscale by/maximum": 2,
"txt2img/Hires. fix/visible": false,
"txt2img/Upscaler/visible": false,
"txt2img/Hires steps/visible": false,
"txt2img/Denoising strength/visible": false,
"txt2img/Upscale by/visible": false,
"txt2img/Resize width to/visible": false,
"txt2img/Resize height to/visible": false,
"txt2img/Sampling method/value": "DPM++ SDE Karras",

"img2img/Width/maximum": 1024,
"img2img/Width/step": 4,
"img2img/Height/maximum": 1024,
"img2img/Height/step": 4,
"img2img/Batch size/maximum": 4,
"img2img/Script/visible": false,
"img2img/Batch size/visible": false,
"img2img/Batch count/visible": false,
```

# 对SD-WEBUI源码的修改
## 样式 
[style.css]
## Python
[ui_gradio_extensions.py]
[ui.py](..%2Fmodules%2Fui.py)
[main_entry.py](..%2Fmodules_forge%2Fmain_entry.py)

## 云存储用户图像
```
[txt2img.py]
[img2img.py]


```
