# PopNotify

仿 `Element Plus` 的通知卡片。

## 📸 展示Demo

## 📌 可选属性

| 属性                     | 说明                                        | 类型     | 可选值                                      | 默认值             |
| ------------------------ | ------------------------------------------- | -------- | ------------------------------------------- | ------------------ |
| title                    | 标题                                        | string   | —                                           | —                  |
| message                  | 通知栏正文内容                              | string   | —                                           | —                  |
| dangerouslyUseHTMLString | 是否将 message 属性作为 HTML 片段处理       | boolean  | —                                           | false              |
| type                     | 通知的类型                                  | string   | success/warning/info/error                  | —                  |
| customClass              | 自定义类名                                  | string   | —                                           | —                  |
| fadeTime                 | 显示时间, 单位为毫秒。值为 0 则不会自动关闭 | number   | —                                           | 4500               |
| position                 | 自定义弹出位置                              | string   | top-right/top-left/bottom-right/bottom-left | top-right          |
| showClose                | 是否显示关闭按钮                            | boolean  | —                                           | true               |
| onClose                  | 关闭时的回调函数                            | function | —                                           | —                  |
| onClick                  | 点击 Notification 时的回调函数              | function | —                                           | ()=>{this.close()} |
| offset                   | 相对屏幕顶部的偏移量                        | number   | —                                           | 0                  |

