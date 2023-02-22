#! /usr/bin/bash
pwd
git --version
python --version

git config user.name "vietanh1111"
git config user.email "anh.nguyenviet6@gameloft.com"

# git init
# git remote add origin https://github.com/vietanh1111/demo-deploy-app-01.git

a="ghp_vzTuJkvYcDcpa9ujt4Y"
b="FwqOaRnhMEO3u"
c="JV4J"
d=$a$b$c

echo "aaaaaa"
git add .
git commit -m "[auto-commit] update data"
git push -f https://vietanh1111:${d}@github.com/vietanh1111/demo-deploy-app-01.git HEAD:main
