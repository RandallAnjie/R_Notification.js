/* Copyright (c) 2023 Randall
 * Licensed under the MIT license 
 * https://github.com/RandallAnjie/RNotification/blob/main/LICENSE
 * Author: Randall  Website: https://randallanjie.com
 */

// 距离顶部高度
if (typeof rPaddingTop == 'undefined') {
    var rPaddingTop = 20;
}

// 距离右侧高度
if (typeof rPaddingRight == 'undefined') {
    var rPaddingRight = 20;
}

// 最大保存弹窗数目
if (typeof rNotificationMaxCount == 'undefined') {
    var rNotificationMaxCount = 5;
}

// 版本信息
if (typeof rNotificationVersion == 'undefined') {
    var rNotificationVersion = "";
}
rNotificationVersion = "V2.2 Beta";

/**
 * 更换最大保存弹窗数目
 * @Author:	Anjie
 * @Date:   2023-09-22
 * @param {int} count
 */
function rChangeNotificationMaxCount(count) {
    rNotificationMaxCount = count;
}

/**
 * 更换距离顶部高度
 * Author:	Anjie
 * @Date:   2023-09-22
 * @param {int} count
 */
function rChangePaddingTop(count) {
    rPaddingTop = count;
}

/**
 * 更换距离右侧高度
 * Author:	Anjie
 * @Date:   2023-09-22
 * @param {int} count
 */
function rChangePaddingRight(count) {
    rPaddingRight = count;
}

// 队列存储随机字符串
var rRandomStrQueue = [];

// 存储随机字符串和对应的弹窗
var rNotificationDict = {};

var mouthPosition = {}

// 如果拖动了链接标签，取消跳转，对于a标签只监听点击事项，不监听拖动事项，如果点击了a标签之后拖动，取消跳转
document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'A') {
        e.preventDefault();
    }
});

document.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
        e.preventDefault();
    }
});

document.addEventListener('mousedown', function (e) {
    mouthPosition = {
        x: e.clientX,
        y: e.clientY
    };
});

document.addEventListener('mouseup', function (e) {
    const endPosition = {
        x: e.clientX,
        y: e.clientY
    }
    if (mouthPosition.x === endPosition.x || mouthPosition.y === endPosition.y) {
        if (e.target.tagName === 'A') {
            // 跳转到新页面
            window.open(e.target.href);
        }
    }
});

// 封装方法
(function () {

    // 未加载完成时的消息队列
    var showMessageQueue = [];

    document.addEventListener("DOMContentLoaded", function () {
        var div = document.createElement("div");
        div.className = "popup-little-container";
        div.style.position = "fixed";
        div.style.top = "0";
        div.style.right = "0";
        div.style.paddingTop = `${rPaddingTop}px`;
        div.style.paddingRight = `${rPaddingRight}px`;
        div.style.zIndex = "9888";
        // 设置最大宽度为100%减去2倍的padding
        div.style.maxWidth = `calc(100vw - ${rPaddingRight * 2}px)`;
        div.style.width = "380px";
        div.style.height = "100%";
        div.style.overflow = "auto";
        div.style.scrollBehavior = "smooth";
        // 设置 maxHeight 为 100% 屏幕高减去 top
        div.style.maxHeight = `calc(100vh - ${div.style.top} * 2)`;

        document.body.appendChild(div);

        // 设置滚动条样式
        var style = document.createElement("style");
        style.innerHTML = `
            .popup-little-container::-webkit-scrollbar {
                display: none; /* WebKit 浏览器*/
            }
            .popup-little-container {
                scrollbar-width: none; /* Firefox */
                -ms-overflow-style: none; /* IE 和 Edge */
            }
        `;
        // 设置div点击穿透，但是子元素不穿透
        style.innerHTML += `
            .popup-little-container {
                pointer-events: none;
            }
            .popup-little-container * {
                pointer-events: auto;
            }
        `;
        // 设置弹窗动画
        style.innerHTML += `
            @keyframes flyInFromRight {
                from {
                    transform: translateX(100%);
                }
                to {
                    transform: translateX(0);
                }
            }
            @keyframes flyInFromTop {
                from {
                    transform: translateX(100%) translateY(-100%);
                }
                to {
                    transform: translateX(0) translateY(0);
                }
            }
        `;
        // 设置popupLittle的样式
        style.innerHTML += `
            .popup-little {
                font-size: medium;
                background-color: #fff;
                color: #000;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                padding: 10px;
                width: calc(100% - 40px);
                margin-left: 10px;
                margin-bottom: 0px;
                margin-top: 10px;
                overflow: hidden;
                /* position: absolute */
                z-index: 9988;
            }
            
            .popup-little-content {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
            }
        `;
        document.head.appendChild(style);

        // 页面加载时，显示sessionStorage中的消息
        let popupText = sessionStorage.getItem('popupText');
        if (popupText) {
            popupText = JSON.parse(popupText);
            popupText.forEach(item => {
                showMessageInJS(item, 0, 'up', 0);
            })
        }
        // DOM 加载之后，输出全部保存的弹窗
        for (var i = 0; i < showMessageQueue.length; i++) {
            showMessageInJS.apply(null, showMessageQueue[i]);
        }
        console.info(`您已经成功加载弹窗插件\n当前版本：${rNotificationVersion}\n详细使用方法及细节: https://notification.randallanjie.com/ \n仓库地址: https://github.com/RandallAnjie/RNotification \nCopyright randallanjie.com © . All rights reserved.\nAuthor: Randall\nWebsite: https://randallanjie.com`);
    });

    /**
     * 显示弹窗（安全判定）
     * @Author:	Anjie
     * @Date:	2023-08-17
     */
    function rShowMessage() {
        var args = Array.prototype.slice.call(arguments);
        var num = Math.random().toString(36).substr(2);
        rRandomStrQueue.push(num);
        if (document.readyState === "loading") {
            // 如果尚未加载DOM，将其推入showMessageQueue
            showMessageQueue.push(args);
            return num;
        } else {
            // 否则直接运行
            return showMessageInJS.apply(null, args);
        }
    }

    /**
     * 创建弹窗元素
     * @Author:	Anjie
     * @Date:	2023-08-17
     * @param text
     * @param save 是否保存到sessionStorage中，1保存，0不保存
     * @returns {HTMLDivElement}
     */
    function createPopupElement(text, save = 1) {
        if (save === 1) {
            let popupText = sessionStorage.getItem('popupText');
            if (popupText) {
                popupText = JSON.parse(popupText);
            } else {
                popupText = [];
            }
            popupText.push(text);
            if (popupText.length > rNotificationMaxCount) {
                popupText.shift();
            }
            sessionStorage.setItem('popupText', JSON.stringify(popupText));
        }
        const popupLittle = document.createElement('div');
        popupLittle.isRemoved = false;
        popupLittle.className = 'popup-little';
        // 新建一个div，用于存放内容
        const popupLittleContent = document.createElement('div');
        popupLittleContent.className = 'popup-little-content';
        popupLittleContent.innerHTML = text;
        popupLittle.appendChild(popupLittleContent);
        popupLittle.pin = false;
        // const height = popupLittle.offsetHeight;
        popupLittle.style.cssText = `
            transition: 
                opacity 0.5s linear,
                width 0.5s linear, 
                height 0.5s 0.5s linear, 
                margin-bottom 0.5s 0.5s linear, 
                margin-top 1s cubic-bezier(0, 0.5, 0.5, 1),
                margin-left 1s cubic-bezier(0, 0.5, 0.5, 1),  
                box-shadow 0.5s linear;
        `;
        return popupLittle;
    }

    /**
     * 处理弹窗的移除
     * @Author:	Anjie
     * @Date:	2023-09-15
     * @param popupElement
     * @param height
     */
    function handleRemoval(popupElement, height) {
        const popupContainer = document.querySelector('.popup-little-container');
        popupElement.style.opacity = 0;
        popupElement.style.marginBottom = `-${height + 10}px`;
        popupElement.style.marginLeft = `${parseInt(popupElement.parentElement.style.width) + 40}px`;
        setTimeout(() => {
            if (!popupElement.isRemoved && popupContainer.contains(popupElement)) {
                popupContainer.removeChild(popupElement);
                popupElement.isRemoved = true;
            }
        }, 1000);
        // 从sessionStorage中删除当前消息
        let popupText = sessionStorage.getItem('popupText');
        let tempMessage = popupElement.textContent;
        if (popupText) {
            popupText = JSON.parse(popupText);
            popupText = popupText.filter(item => item != tempMessage);
            sessionStorage.setItem('popupText', JSON.stringify(popupText));
        }
        // 从字典中删除当前消息
        for (var key in rNotificationDict) {
            if (rNotificationDict[key] == popupElement) {
                delete rNotificationDict[key];
            }
        }
    }

    /**
     * 显示弹窗
     * 2023-09-04 fixed: 重复消息只显示一次
     * @Author:	Anjie
     * @Date:	2023-08-17
     * @param message
     * @param save 是否保存到sessionStorage中，1 保存 0 不保存
     * @param position 在顶部显示还是在底部显示，up 顶部 down 底部
     * @param autoDisappearTime 自动消失时间，单位毫秒，0为不消失
     */
    function showMessageInJS(message, save = 0, position = 'up', autoDisappearTime = 0) {
        let popupText = sessionStorage.getItem('popupText');
        if (popupText) {
            popupText = JSON.parse(popupText);
            if (popupText.indexOf(message) >= 0 && save == 1) {
                return;
            }
        }
        const popupContainer = document.querySelector('.popup-little-container');
        const popupLittle = createPopupElement(message, save);

        if (position === 'up') {
            popupContainer.prepend(popupLittle);
            // animateFlyIn(popupLittle, 'flyInFromTop');

            popupContainer.prepend(popupLittle);
            const rect = popupLittle.getBoundingClientRect();
            const height = rect.height;
            popupLittle.style.animation = 'flyInFromTop 1s forwards';
            // 找到第二个元素，设置其margin-top
            const secondElement = popupContainer.children[1];
            if (secondElement) {
                // Temporarily disable the transition
                secondElement.style.transition = 'none';
                secondElement.style.marginTop = `-${height}px`;

                // Force a reflow to ensure the above changes are applied immediately
                void secondElement.offsetWidth;

                // Re-enable the transition and reset margin-top to start the transition
                secondElement.style.transition = `
                    opacity 0.5s linear, 
                    height 0.5s 0.5s linear, 
                    margin-bottom 0.5s 0.5s linear, 
                    margin-top 1s cubic-bezier(0, 0.5, 0.5, 1), 
                    margin-left 1s cubic-bezier(0, 0.5, 0.5, 1),
                    box-shadow 0.5s linear
                `;

                setTimeout(() => {
                    // secondElement.style.marginTop = '0px';
                    secondElement.style.marginTop = '10px';
                }, 0); // short delay to ensure the transition gets applied
            }
            // 平滑滚动到顶部
            popupContainer.scrollTop = 0;
            popupLittle.style.opacity = "1";
            // rect = popupLittle.getBoundingClientRect();
            // height = rect.height;
            popupLittle.style.marginBottom = `-${height}px`;
            setTimeout(() => {
                popupLittle.style.marginBottom = '10px';
            }, 10);
        } else if (position === 'down') {
            popupContainer.appendChild(popupLittle);
            // animateFlyIn(popupLittle, 'flyInFromRight');

            popupContainer.appendChild(popupLittle);
            popupLittle.style.animation = 'flyInFromRight 1s forwards';
            // 平滑滚动到底部
            popupContainer.scrollTop = popupContainer.scrollHeight;
            popupLittle.style.opacity = "1";
            // const rect = popupLittle.getBoundingClientRect();
            // const height = rect.height;
            // popupLittle.style.marginBottom = `-${height}px`;
            setTimeout(() => {
                popupLittle.style.marginBottom = '10px';
            }, 10);
        }
        // 添加点击事件，判断点击的时候是否有是按下了alt键，如果是，等松开alt键后复制选中的文本
        popupLittle.addEventListener('mousedown', (e) => {
            if (e.altKey) {
                document.onmouseup = function () {
                    // 获取选中的文本
                    const selection = window.getSelection();
                    const text = selection.toString();
                    if (text) {
                        // 复制选中的文本
                        try {
                            navigator.clipboard.writeText(text).then(r => {
                                rStatusMessage.success("您已成功复制：" + text, "复制代码成功～");
                            });
                        } catch (err) {
                            rStatusMessage.error(err, "复制代码错误", 0, 'up', 0);
                        }
                    }
                    // 使得弹窗闪烁一下
                    popupLittle.style.boxShadow = '0 0 10px #91cd85';
                    setTimeout(() => {
                        popupLittle.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
                    }, 500);
                }
            } else {
                popupLittle.style.transition = 'none';
                // 设置不允许选中任何文本
                document.onselectstart = function () {
                    return false;
                }
                // 设置允许拖动弹窗，只允许水平移动，修改他的marginLeft，让弹窗实时跟随鼠标移动
                // 获取当前弹窗的marginLeft
                const marginLeft = parseInt(window.getComputedStyle(popupLittle).marginLeft);
                const zIndex = parseInt(window.getComputedStyle(popupLittle).zIndex);
                popupLittle.style.zIndex = '9999';
                // 获取鼠标当前位置
                const startX = e.clientX;
                // 弹窗跟随鼠标移动
                document.onmousemove = function (e) {
                    const endX = e.clientX;
                    popupLittle.style.marginLeft = `${marginLeft + endX - startX}px`;
                };
                // 鼠标松开时，取消拖动
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    // 设置允许选中任何文本
                    document.onselectstart = function () {
                        return true;
                    }
                    popupLittle.style.transition = `
                        opacity 0.5s linear, 
                        height 0.5s 0.5s linear, 
                        margin-bottom 0.5s 0.5s linear, 
                        margin-top 1s cubic-bezier(0, 0.5, 0.5, 1), 
                        margin-left 1s cubic-bezier(0, 0.5, 0.5, 1),
                        box-shadow 0.5s linear
                    `;
                    const rect = popupLittle.getBoundingClientRect();
                    const width = rect.width;
                    if (parseInt(window.getComputedStyle(popupLittle).marginLeft)-marginLeft > width / 3) {
                        handleRemoval(popupLittle, rect.height);
                    } else if(marginLeft - parseInt(window.getComputedStyle(popupLittle).marginLeft) > 10) {
                        changePinStatus(popupLittle);
                        // 弹窗回到原来的位置
                        popupLittle.style.marginLeft = `${marginLeft}px`;
                        popupLittle.style.zIndex = `${zIndex}`;
                    }else {
                        popupLittle.style.marginLeft = `${marginLeft}px`;
                        popupLittle.style.zIndex = `${zIndex}`;
                    }

                }
            }
        });

        if (autoDisappearTime > 0) {
            popupLittle.timeOut = setTimeout(() => {
                const rect = popupLittle.getBoundingClientRect();
                const height = rect.height;
                handleRemoval(popupLittle, height);
            }, autoDisappearTime);
        } else {
            changePinStatus(popupLittle);
        }

        // 保存到字典中，取出rRandomStrQueue中的第一个随机字符串
        var randomString = rRandomStrQueue.shift();
        rNotificationDict[randomString] = popupLittle;
        return randomString;
    }

    /**
     * 改变弹窗Pin状态
     * @Author:	Anjie
     * @Date:	2023-10-19
     * @param popupLittle
     */
    function changePinStatus(popupLittle) {
        if(popupLittle.pin){
            popupLittle.pin = false;
            // 删除svg
            popupLittle.removeChild(popupLittle.lastChild);
        }else{
            popupLittle.pin = true;
            // 插入svg到右上角，并且随着弹窗移动
            // <svg t="1697685288185" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3116" width="200" height="200"><path d="M978.88 330.24l-294.08-294.4A62.08 62.08 0 0 0 597.44 32a62.08 62.08 0 0 0 3.2 87.04l22.72 22.72-154.56 155.2a320 320 0 0 0-266.56 64 29.44 29.44 0 0 0-2.24 43.52L608 814.72a29.44 29.44 0 0 0 43.52-2.24 320 320 0 0 0 64-266.56l154.56-154.56 22.72 22.72a62.08 62.08 0 0 0 87.36 3.2 62.08 62.08 0 0 0-1.28-87.04zM69.44 896a23.36 23.36 0 0 0 0 32l14.72 14.72a23.36 23.36 0 0 0 32 0l264.64-222.08-89.28-87.68z" fill="#1296db" p-id="3117"></path></svg>
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("t", "1697685288185");
            svg.setAttribute("class", "icon");
            svg.setAttribute("viewBox", "0 0 1024 1024");
            svg.setAttribute("version", "1.1");
            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svg.setAttribute("p-id", "3116");
            svg.setAttribute("width", "20");
            svg.setAttribute("height", "20");
            svg.style.cssText = `
                position: absolute;
                top: 0;
                right: 0;
                margin-top: 5px;
                margin-right: 5px;
                width: 10px;
                height: 10px;
                z-index: 9999;
            `;
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M978.88 330.24l-294.08-294.4A62.08 62.08 0 0 0 597.44 32a62.08 62.08 0 0 0 3.2 87.04l22.72 22.72-154.56 155.2a320 320 0 0 0-266.56 64 29.44 29.44 0 0 0-2.24 43.52L608 814.72a29.44 29.44 0 0 0 43.52-2.24 320 320 0 0 0 64-266.56l154.56-154.56 22.72 22.72a62.08 62.08 0 0 0 87.36 3.2 62.08 62.08 0 0 0-1.28-87.04zM69.44 896a23.36 23.36 0 0 0 0 32l14.72 14.72a23.36 23.36 0 0 0 32 0l264.64-222.08-89.28-87.68z");
            path.setAttribute("fill", "#1296db");
            path.setAttribute("p-id", "3117");
            svg.appendChild(path);
            popupLittle.appendChild(svg);
            // 取消弹窗的settimeout
            if(popupLittle.timeOut){
                clearTimeout(popupLittle.timeOut);
            }
        }
    }

    /**
     * Success弹窗预设
     * @Author:	Anjie
     * @Date:	2023-09-20
     * @param comtain
     * @param title
     * @param save
     * @param position
     * @param autoDisappearTime
     */
    function rSuccessMessage(comtain, title = '', save = 0, position = 'up', autoDisappearTime = 2000) {
        var msg =
            `<div>
                <div>
                    <div style="display:flex;">
                        <span role="img" aria-label="check-circle" style="color:#52c41a;">
                            <svg focusable="false" data-icon="check-circle" width="2em" height="2em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896">
                                <path d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0051.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"></path>
                                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                            </svg>
                        </span>
                        <div style="padding-left:10px; padding-right:10px">
                            <div style="margin-top: 2px; margin-buttom: 5px; margin-left: 5px; margin-right: 5px; font-size: 20px;">
                                ${title}
                            </div>
                            <div style="margin-top: 5px; margin-left: 5px;">
                                ${comtain}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        return rShowMessage(msg, save, position, autoDisappearTime)
    }

    /**
     * Info弹窗预设
     * @Author:	Anjie
     * @Date:	2023-09-20
     * @param comtain
     * @param title
     * @param save
     * @param position
     * @param autoDisappearTime
     */
    function rInfoMessage(comtain, title = '', save = 0, position = 'up', autoDisappearTime = 2000) {
        var msg =
            `<div>
                <div>
                    <div style="display:flex;">
                        <span role="img" aria-label="check-circle" style="color:#1677ff;">
                            <svg focusable="false" data-icon="check-circle" width="2em" height="2em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896">
                            <path
                                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z">
                            </path>
                            <path
                                d="M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z">
                            </path>
                            </svg>
                        </span>
                        <div style="padding-left:10px; padding-right:10px">
                            <div style="margin-top: 2px; margin-buttom: 5px; margin-left: 5px; margin-right: 5px; font-size: 20px;">
                                ${title}
                            </div>
                            <div style="margin-top: 5px; margin-left: 5px;">
                                ${comtain}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        return rShowMessage(msg, save, position, autoDisappearTime)
    }

    /**
     * Warning弹窗预设
     * @Author:	Anjie
     * @Date:	2023-09-20
     * @param comtain
     * @param title
     * @param save
     * @param position
     * @param autoDisappearTime
     */
    function rWarningMessage(comtain, title = '', save = 0, position = 'up', autoDisappearTime = 2000) {
        var msg =
            `<div>
                <div>
                    <div style="display:flex;">
                        <span role="img" aria-label="check-circle" style="color:#faad14;">
                            <svg focusable="false" data-icon="check-circle" width="2em" height="2em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896">
                            <path
                                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z">
                            </path>
                            <path
                                d="M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z">
                            </path>
                            </svg>
                        </span>
                        <div style="padding-left:10px; padding-right:10px">
                            <div style="margin-top: 2px; margin-buttom: 5px; margin-left: 5px; margin-right: 5px; font-size: 20px;">
                                ${title}
                            </div>
                            <div style="margin-top: 5px; margin-left: 5px;">
                                ${comtain}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        return rShowMessage(msg, save, position, autoDisappearTime)
    }

    /**
     * Error弹窗预设
     * @Author: Anjie
     * @Date:   2023-09-20
     * @param comtain
     * @param title
     * @param save
     * @param position
     * @param autoDisappearTime
     */
    function rErrorMessage(comtain, title = '', save = 0, position = 'up', autoDisappearTime = 2000) {
        var msg =
            `<div>
                <div>
                    <div style="display:flex;">
                        <span role="img" aria-label="check-circle" style="color:#ff4d4f;">
                            <svg focusable="false" data-icon="check-circle" width="2em" height="2em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896">
                            <path
                                d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 00-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z">
                            </path>
                            <path
                                d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z">
                            </path>
                            </svg>
                        </span>
                        <div style="padding-left:10px; padding-right:10px">
                            <div style="margin-top: 2px; margin-buttom: 5px; margin-left: 5px; margin-right: 5px; font-size: 20px;">
                                ${title}
                            </div>
                            <div style="margin-top: 5px; margin-left: 5px;">
                                ${comtain}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        return rShowMessage(msg, save, position, autoDisappearTime)
    }

    /**
     * 变更某一个弹窗的内容
     * @Author: Anjie
     * @Date:   2023-09-22
     * @param index
     * @param message
     */
    function rChangeNotificationMessage(index, message) {
        // 获取选择的弹窗
        const popupContainer = document.querySelector('.popup-little-container');
        const popupLittle = rNotificationDict[index];
        // 判断弹窗内容是不是在sessionStorage中，如果在，就替换
        let popupText = sessionStorage.getItem('popupText');
        if (popupText) {
            popupText = JSON.parse(popupText);
            if (popupText.indexOf(popupLittle.textContent) >= 0) {
                popupText[popupText.indexOf(popupLittle.textContent)] = message;
                sessionStorage.setItem('popupText', JSON.stringify(popupText));
            }
        }
        // 替换弹窗内容
        popupLittle.getElementsByClassName('popup-little-content')[0].innerHTML = message;
        // 使得弹窗闪烁一下
        popupLittle.style.boxShadow = '0 0 10px #91cd85';
        setTimeout(() => {
            popupLittle.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        }, 500);
    }

    window.rShowMessage = rShowMessage;
    window.rChangeMessage = rChangeNotificationMessage;
    window.rStatusMessage = {
        success: rSuccessMessage,
        info: rInfoMessage,
        warning: rWarningMessage,
        error: rErrorMessage
    }
})();
