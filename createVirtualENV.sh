#!/bin/bash

if [ ! $1 ];then
    echo "您需要输入额外参数来定义虚拟环境中的Python环境"
    echo "例如：python3 pypy3 等"
    exit 0;
fi

PYTHON_PATH=`which $1`
if [ ! $PYTHON_PATH ];then
    echo "您的系统没有安装 '$1'，请先安装该程序"
    exit 0;
fi

virtualenv --no-site-packages -p $1 env
env/bin/pip install -r requirements.txt
