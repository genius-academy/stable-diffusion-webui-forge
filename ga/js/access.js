//环境:local,test,prod
let env = 'local';
//默认用户类型，0普通用户，3管理员
let defaultVipType = 0;
let rootpath;
let apiPath;
let sdapiPath;
let origin;
let origin_parent;
let content_type_json='application/json';
let content_type_form='form-data';
let homePage;
let currentUser;
let perResidue;
if(env == 'local'){
    rootpath = 'D:\\project\\git\\stable-diffusion-webui-forge';
    apiPath = 'http://127.0.0.1:7861/api';
    sdapiPath = 'http://127.0.0.1:7861/sdapi';
    origin = '127.0.0.1:7891';
    homePage = 'http://127.0.0.1:7861';
    origin_parent = 'http://localhost:8081';
    window.enableAMISDebug = true;
    defaultVipType = 3;
}else if(env == 'prod'){
    rootpath = '/var/www/html/stable-diffusion-webui-forge';
    apiPath = 'https://sd1.geniusitedu.com/api';
    sdapiPath = 'https://sd1.geniusitedu.com/sdapi';
    origin = 'sd1.geniusitedu.com';
    homePage = 'https://sd1.geniusitedu.com';
    origin_parent = 'https://paint.geniusitedu.com';
}

window.addEventListener('message',(e)=>{
    if(e.origin === origin_parent){
        var jsonData = eval("(" + e.data + ")");
        localStorage.setItem('ga-user-token', jsonData['ga-user-token']);
        localStorage.setItem('ga-user-id', jsonData['ga-user-id']);
        localStorage.setItem('ga-user-vipType', jsonData['ga-user-vipType']);
    }
});

function getVipType(){
    if(currentUser!=null && 'vipType' in currentUser){
        return currentUser['vipType'];
    }
    return defaultVipType;
}

function isUser(){
    vipType = getVipType();
    if(vipType == 0){
        return true;
    }
    return false;
}

function isAdmin(){
    vipType = getVipType();
    if(vipType == 3){
        return true;
    }
    return false;
}

function requestSdApiGet(url, handler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("accept", content_type_json);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var js = JSON.parse(xhr.responseText);
                    handler(js);
                } catch (error) {
                    console.error(error);
                    errorHandler();
                }
            } else {
                errorHandler();
            }
        }
    };
    xhr.send();
}

function requestApiPost(url, data, handler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", content_type_json);
    xhr.setRequestHeader("Authorization", getToken());
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var js = JSON.parse(xhr.responseText);
                    handler(js);
                } catch (error) {
                    console.error(error);
                    errorHandler();
                }
            } else {
                errorHandler();
            }
        }
    };
    var js = JSON.stringify(data);
    xhr.send(js);
}

function getToken(){
    if(localStorage!=null && localStorage.length>0){
        return localStorage.getItem('ga-user-token');
    }
    return '';
}

function getCookie(name){
    var cookieArr = document.cookie.split("; ");//分割
    //遍历匹配
    for ( var i = 0; i < cookieArr.length; i++) {
        var arr = cookieArr[i].split("=");
        var key = decodeURIComponent(arr[0]);
        if (key == name){
            return decodeURIComponent(arr[1]);
        }
    }
    return "";
}

function getCurrentUser(){
    if(getToken()==null || getToken().length == 0){
        console.error('token is null...');
        return;
    }
    var url = apiPath+'/user/getCurrentUserSuccess';
    requestApiPost(url, null, function(data){
        if('data' in data){
            currentUser = data['data'];
        }
    }, function(data){
        console.error(data);
    });

}

function getCurrentService(){
    if(currentUser == null){
        console.error('currentUser is null...');
        return;
    }
    var url = apiPath+'/user/getCurrentService';
    requestApiPost(url, null, function(data){
        if('data' in data){
            perResidue = data['data']['perResidue'];
            generatePerCheck();
//            console.log("getCurrentService.perResidue:"+perResidue);
        }
    }, function(data){
        console.error(data);
    });

}

function useTimes(perCount){
    if(perCount == null){
        console.error('perCount is null...');
        return;
    }
    perResidue = perResidue-perCount;
    var url = apiPath+'/service/useTimes';
    var requestData = {"perCount" : perCount};
    requestApiPost(url, requestData, function(data){
        if('data' in data){
            perResidue = data['data']['perResidue'];
        }
    }, function(data){
        console.error(data);
    });

}

function addUserImages(generation_info){
    if(generation_info==null || generation_info.length==0){
        return;
    }
    var image_urls = generation_info['image_urls'];
    delete generation_info['image_urls'];
    console.info(image_urls);

    var url = apiPath+'/userImages/addImagesAndObjects';
    var requestData = {
        "image_urls" : image_urls,
        "prompt":generation_info['prompt'],
        "negPrompt":generation_info['negative_prompt'],
        "config":generation_info
    };
    requestApiPost(url, requestData, function(data){
        if('data' in data){
            console.info('add images to OBS success, ids=', data['data']['ids']);
        }
    }, function(data){
        console.error(data);
    });

}

function toLogin(){
    var param = "?redirect="+homePage;
    window.location.href="/login"+param;
}


hideTabs = ["Checkpoint Merger", "Settings", "Extensions"];
hideDomIds = ["quicksettings"];
function accessControl(){
    if(isUser()){
        domStyleSetting('none');

    }else if(isAdmin()){
        domStyleSetting('flex');
    }
}

function domStyleSetting(display){
    tabs = document.getElementById('tabs');
    buttons = tabs.getElementsByClassName('tab-nav')[0].getElementsByTagName('button');
    Array.from(buttons).forEach((button) => {
        if(hideTabs.includes(button.innerHTML.trim())){
            button.style.display = display;
        }
    });
    hideDomIds.forEach((id) => {
        if(document.getElementById(id)){
            dom = document.getElementById(id);
            dom.style.display = display;
        }
    });
    document.getElementById('image_buttons_txt2img').children[0].style.display = display;
    document.getElementById('image_buttons_img2img').children[0].style.display = display;
    document.getElementById('image_buttons_extras').children[0].style.display = display;

    //模型搜索控制
//    document.getElementById('txt2img_extra_refresh').style.display = display;

    //img2img sketch控制
    var img2img_copy = document.getElementById('img2img_copy_to_img2img');
    img2img_copy_buttons = img2img_copy.getElementsByTagName('button');
    Array.from(img2img_copy_buttons).forEach((button) => {
        if(button.innerHTML.trim().indexOf("sketch") != -1){
            button.style.display = display;
        }
    });

}

var genBtnDomIds = ["txt2img_generate", "img2img_generate", "extras_generate"];
function generateEventListener(){
    genBtnDomIds.forEach((domId) => {
        document.getElementById(domId).addEventListener("click", generateEventFunc(domId));
    });
}

function generatePerCheck(){
    //检查生图次数
    if(perResidue == 0){
        genBtnDomIds.forEach((domId) => {
            generateBtnGrey(domId);
        });
    }
}

function generateEventFunc(domId){
    return function () {
        if(perResidue > 0){
            return;
        }
        generateBtnGrey(domId);
    };
}

function generateBtnGrey(domId){
    var genBtn = document.getElementById(domId);
    var genBtnClone = genBtn.cloneNode(true);
    genBtn.style.display = 'none';
    genBtnClone.setAttribute("id", domId + '_0');
    genBtnClone.style.background = '#b4c0cc';
    genBtnClone.style.borderColor = '#b4c0cc';
//    var div = genBtnClone.getElementsByTagName("div")[0];
    genBtnClone.innerHTML = 'Jumlah kali yang tersedia adalah 0.<em>The number of available times is 0.</em>';
    genBtn.parentNode.insertBefore(genBtnClone, genBtn.nextSibling);
}

/*监听异常日志*/
var errorLogDomIds = ["html_log_txt2img", "html_log_img2img", "html_log_extras"];
var errorLogListenerConfig = { attributes: false, characterData: true, childList: true, subtree: false };
function errorLogListener(){
    errorLogDomIds.forEach((domId) => {
        var targetNode = document.getElementById(domId);
        if(targetNode!=null){
            targetNode = targetNode.querySelector("#"+domId);
        }
        // 观察器的配置（需要观察什么变动）
        var logObserver = new MutationObserver(errorLogListenerCallback);
        logObserver.observe(targetNode, errorLogListenerConfig);
    });
}

function errorLogListenerCallback(mutationsList, observer){
    observer.disconnect();
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for (let node of mutation.addedNodes){
                if(node.getAttribute('class') == 'error'){
                    node.innerHTML = 'Banyak orang dalam antrean. Silakan coba lagi nanti.'
                        +'<br/><em>There are many people in the queue. Please try again later.</em>';
                }
            }
        }else if (mutation.type === 'characterData') {
            console.log('The ' + mutation.type + ' attribute was modified.');
        }

        var targetNode = mutation.target;
        observer.observe(targetNode, errorLogListenerConfig);
    }
}

/*监听图像生成*/
var imgGalleryDomIds = ["txt2img_gallery", "img2img_gallery", "extras_gallery"];
var imgGalleryListenerConfig = { attributes: false, characterData: false, childList: true, subtree: false };
var imgContainerListenerConfig = { attributes: true, characterData: false, childList: false, subtree: false };
function imgGalleryListener(){
    imgGalleryDomIds.forEach((domId) => {
        var targetNode = document.getElementById(domId);
        // 观察器的配置（需要观察什么变动）
        var observer = new MutationObserver(imgGalleryListenerCallback);
        observer.observe(targetNode, imgGalleryListenerConfig);
    });
}
function imgGalleryListenerCallback(mutationsList, observer){
    for(let mutation of mutationsList) {
        var targetNode = mutation.target;
        if(imgGalleryDomIds.includes(targetNode.getAttribute('id'))){
            if (mutation.type === 'childList') {
                for (let node of mutation.addedNodes){
                    if(node.nodeType==1 && node.classList.contains('grid-wrap')){
                        var imgs = node.querySelectorAll("img");
                        if(imgs!=null && imgs.length>0){
                            useTimes(1);
                        }
                        //更新监听器
                        observer.disconnect();
                        newTargetNode = imgs[0];
                        observer.observe(newTargetNode, imgContainerListenerConfig);
                    }
                }
            }
        }else if(targetNode.tagName === 'IMG'){
            if (mutation.type === 'attributes') {
                if (mutation.attributeName === 'src'){
//                    console.log(targetNode);
                    useTimes(1);
                }
            }
        }
    }
}

/*监听图像生成*/
var generationInfoDomDatas = {"generation_info_txt2img":"{}", "generation_info_img2img":"{}"};
function generationInfoListener(){
    var checkGenerationInfo = window.setInterval(() => {
       for(var domId in generationInfoDomDatas) {
           var textarea = document.getElementById(domId).getElementsByTagName('textarea')[0];
           var value = textarea.value;
           if (value!=="" && value !== generationInfoDomDatas[domId]) {
                generation_info_old = JSON.parse(generationInfoDomDatas[domId]);
                generationInfoDomDatas[domId] = value;
                generation_info = JSON.parse(value);

                addUserImages(generation_info);
           }
       }
    }, 1000);

}

//关闭窗口的提示
function closeWindowsListener(){
    window.addEventListener("beforeunload", function(event) {
        var confirmationMessage = "The image you generated has not been downloaded";
        event.preventDefault();
        event.returnValue = confirmationMessage;
    });
}


window.onload = function(){

    getCurrentUser();
    //菜单权限控制
//    app = document.getElementsByTagName("gradio-app")[0];
    loadInterval = setInterval(checkUiLoad, 1000);
    function checkUiLoad(){
//        console.log('loadInterval');
        if(document.getElementById('tabs')){
            try {
                //权限控制
                accessControl();
                //生成图像事件监听
                generateEventListener();
                //异常日志监听
                errorLogListener();
                //相册监听
                imgGalleryListener();
                //生成信息监听
                generationInfoListener();
                //关闭窗口事件监听
//                closeWindowsListener();
            }catch(err){
                console.error(err.message);
            }
            clearInterval(loadInterval);
        }
    }

    //持续检索用户状态
    userStatusInterval = setInterval(checkUserStatus, 5*1000);
    function checkUserStatus(){
        try {
            getCurrentUser();
            getCurrentService();
        }catch(err){
            console.error(err.message);
        }
        if(currentUser != null){
            accessControl();
            clearInterval(userStatusInterval);
        }
    }

}
