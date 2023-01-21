#! /usr/bin/bash
pwd
git --version
python --version

git config user.name "vietanh1111"
git config user.email "anh.nguyenviet6@gameloft.com"

# git init
# git remote add origin https://github.com/vietanh1111/demo-deploy-app-01.git

echo "aaaaaa"
git add .
git commit -m "asadsa"
git push https://vietanh1111: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@github.com/vietanh1111/demo-deploy-app-01.git HEAD
