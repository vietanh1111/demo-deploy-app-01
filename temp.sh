#! /usr/bin/bash
pwd
git --version
python --version

git init
git remote add origin https://github.com/vietanh1111/demo-deploy-app-01.git

git config user.name "vietanh6"
git config user.email "anh.nguyenviet6@gameloft.com"
git add .
git commit -m "asadsa"
git push origin