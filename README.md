# chatgpt-web
一个简易的网页版chatgpt，预览：[https://chatgpt.web.liushuaiyang.com](http://chatgpt.web.liushuaiyang.com)

> 如果你喜欢这个项目，请star✨

> 如果你发现一些问题或是优化建议，欢迎提出issues、pr

## 前端开发
- 可以自己开发前端页面，不过多阐述，在页面中调用云开发平台云函数的接口就行了
- 不想自己动手

   - 一键部署（点击下方按钮）
     - [![Deploy with Vercel](https://vercel.com/button?utm_source=busiyi&utm_campaign=oss)](https://vercel.com/new/clone?utm_source=busiyi&utm_campaign=oss&repository-url=https://github.com/LsyWeb/chatgpt-web&env=VITE_AIR_CODE_SEND_MESSAGE_URL)
   - 本地开发
  
      - 可以直接 fork 项目代码到自己的仓库
      - 在本地把项目克隆下来 `git clone`，下载依赖 `yarn`
      - 在项目的根目录新建一个 `.env.local` 或者 `.env` 文件，然后添加一个环境变量[（vite设置环境变量）](https://cn.vitejs.dev/guide/env-and-mode.html#env-variables-and-modes) `VITE_AIR_CODE_SEND_MESSAGE_URL = '你的后端接口访问地址' `
   - 配置好之后直接：`yarn start`

## 部署
- 使用 [vercel](https://vercel.com/) 一键部署，并且支持自动化部署（在github提交代码，自动部署，点击下方按钮一键部署）

  [![Deploy with Vercel](https://vercel.com/button?utm_source=busiyi&utm_campaign=oss)](https://vercel.com/new/clone?utm_source=busiyi&utm_campaign=oss&repository-url=https://github.com/LsyWeb/chatgpt-web&env=VITE_AIR_CODE_SEND_MESSAGE_URL)

- [vercel](https://vercel.com/) 部署流程：
  - 登录网站，注册账号
  - 创建项目，导入刚刚fork的github仓库
  - 填写项目名、构建部分不需要设置（vercel会检测到你的项目是vite，自动帮你设置）
  - **重点来了，设置环境变量**：`name: VITE_AIR_CODE_SEND_MESSAGE_URL` `value: 你的云函数访问路径`，设置完后，vercel会帮你生成一个.env文件，用于vite构建时获取，并且，value会被vercel加密
  - 点击部署，稍等片刻，就部署成功了，vercel会自动生成一个域名，你也可以绑定自定义域名
  - 绑定自定义域名：vercel在国内是被墙的，没有代理无法访问，想要解决这个问题：你需要绑定一个自定义域名，绑定完后vercel会自动给你的域名加上一个SSL证书，然后就可以在国内使用https的方式进行访问，速度也非常快
## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=LsyWeb/chatgpt-web&type=Date)](https://star-history.com/#LsyWeb/chatgpt-web&Date)
