#! /usr/bin/bash
pwd
git --version
python --version

git config user.name "vietanh1111"
git config user.email "anh.nguyenviet6@gameloft.com"

# git init
# git remote add origin https://github.com/vietanh1111/demo-deploy-app-01.git

a="ghp_"
b="Wik1hg27sXecx2sJJcS8XO1R9XwtFh3LdD"
c="7e"
d=$a$b$c

echo "aaaaaa"
git add .
git commit -m "asadsa"
git push https://vietanh1111:${d}github.com/vietanh1111/demo-deploy-app-01.git HEAD
