# PassBank

一个简单的在线密码托管 Web App，可以托管密码、生成强密码。用户可以通过一站一密的使用习惯，避免因为拖库带来的连带损失。

用户可以自建内网服务器，后台使用 Python3 下 Flask 框架，数据库使用PostgreSQL；前端使用 AngularJS 结合 Html 5 + CSS 3 构成。

[在线 Web App](https://qmz.me)， 菜单在左上角，可以简单注册后体验。

##  下一步工作

- 完成前端加密
- 在用户设置页面中加入删除账户

## 自建方式

1. 简历虚拟开发环境
	
		./createVirtualENV.sh python3
		
2. 安装 NPM 环境

		npm install
		npm install bower gulp -g --unsafe-perm
	
3. 安装 JS、CSS 库

		bower install
		
4. 编译 Javascript 脚本

		gulp build
		
5. 设置数据库，并编辑 *config.py* 文件，根据实际情况修改配置
6. 初始化数据库关系

		./database_init.py
		
	如果要添加测试数据，可以使用：
		
		./database_init.py debug
		
	7.使用uwsgi或者fastcgi连接Nginx/Apache即可	